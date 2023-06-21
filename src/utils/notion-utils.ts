import axios, { AxiosInstance } from 'axios';
import { NOTION_TOKEN } from '../consts';
import { TEST_NOTION_DATABASES, TEST_NOTION_PAGES } from '../test/test-data';
import {
  ItemType,
  NotionDatabaseObject,
  NotionPageObject,
  NotionPageOrDatabaseObject,
  NotionProp,
  NotionPropertyType,
  NotionTitle,
  NotionTitleProp,
} from '../types';

const notionApiUrl = 'https://api.notion.com/v1/';
const notionVersion = '2022-06-28';

export const createPageInDatabase = async (
  database_id: string,
  properties: any,
  pageContent: string,
): Promise<NotionPageObject> => {
  return await createNewPage({ database_id }, properties, pageContent);
};

export const createPageInParentPage = async (
  page_id: string,
  title: string,
  content: string,
): Promise<NotionPageObject> => {
  const properties = {
    title: [
      {
        text: {
          content: title,
        },
      },
    ],
  };

  return await createNewPage({ page_id }, properties, content);
};

export const createNewPage = async (parent: any, properties: any, pageContent: string): Promise<NotionPageObject> => {
  const children = [
    {
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [
          {
            type: 'text',
            text: {
              content: pageContent,
            },
          },
        ],
      },
    },
  ];

  if (process.env.REACT_APP_OFFLINE) {
    console.log('Offline request');
    console.log(
      JSON.stringify(
        {
          parent,
          properties,
          children,
        },
        null,
        2,
      ),
    );
    await sleep(2);

    return {} as NotionPageObject;
  } else {
    const response = await createNotionApiClient().post('pages', {
      parent,
      properties,
      children,
    });

    console.log(JSON.stringify(response.data, null, 2));

    return response.data;
  }
};

// TBD - Add Notion block to types
export const addToPage = async (pageId: string, content: string): Promise<any> => {
  const children = [
    {
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [
          {
            type: 'text',
            text: {
              content,
            },
          },
        ],
      },
    },
  ];

  if (process.env.REACT_APP_OFFLINE) {
    console.log('Offline request');
    console.log(
      JSON.stringify(
        {
          children,
        },
        null,
        2,
      ),
    );
    await sleep(2);

    return {};
  } else {
    const response = await createNotionApiClient().patch(`blocks/${pageId}/children`, {
      children,
    });

    console.log(JSON.stringify(response.data, null, 2));

    return response.data;
  }
};

export const fetchTestDatabases = async (): Promise<NotionDatabaseObject[]> => {
  await sleep(2);
  return Promise.resolve(TEST_NOTION_DATABASES);
};

export const fetchTestPages = async (): Promise<NotionPageObject[]> => {
  await sleep(2);
  return Promise.resolve(TEST_NOTION_PAGES);
};

export const fetchNotionItemsByType = async (itemType: ItemType): Promise<NotionPageOrDatabaseObject[]> => {
  const items: NotionPageOrDatabaseObject[] = [];

  if (process.env.REACT_APP_OFFLINE) {
    switch (itemType) {
      case ItemType.database:
        return await fetchTestDatabases();
      case ItemType.page:
        return await fetchTestPages();
    }
  } else {
    await iterateResults(createNotionApiClient(), itemType, items);

    console.log(`Fetched ${items.length} results!`);

    return items;
  }
};

export const getName = (item: NotionPageOrDatabaseObject): string => {
  if (!item) return '';

  let name = item.url;

  switch (item.object) {
    case ItemType.page:
      name = getPageName(item);
      break;
    case ItemType.database:
      name = getDatabaseName(item);
      break;
    default:
      break;
  }

  return name;
};

export const getTitlePropFromDb = (db: NotionDatabaseObject): NotionProp | null => {
  let prop = null;
  Object.keys(db.properties).forEach(propName => {
    if (db.properties[propName].type === NotionPropertyType.title) {
      prop = db.properties[propName];
    }
  });
  return prop;
};

export const formatPropValues = (
  propValues: {
    propName: string;
    propType: NotionPropertyType;
    propValue: string;
  }[],
): any => {
  let propertiesWithValues: any = {};

  propValues.forEach(prop => {
    switch (prop.propType) {
      case NotionPropertyType.title:
        propertiesWithValues[prop.propName] = {
          title: [
            {
              text: {
                content: prop.propValue,
              },
            },
          ],
        };
        break;

      case NotionPropertyType.select:
        propertiesWithValues[prop.propName] = {
          select: {
            name: prop.propValue,
          },
        };

        break;

      case NotionPropertyType.rich_text:
        propertiesWithValues[prop.propName] = {
          rich_text: [
            {
              text: {
                content: prop.propValue,
              },
            },
          ],
        };

        break;

      default:
        break;
    }
  });

  return propertiesWithValues;
};

export const parseFromLocalStorage = (storageKey: string): any | null => {
  const strData = localStorage.getItem(storageKey);
  if (strData) {
    return JSON.parse(strData);
  } else {
    return null;
  }
};

const getPageName = (page: NotionPageObject): string => {
  let name = page.url;

  Object.keys(page.properties).forEach(propName => {
    const property = page.properties[propName];
    if (property.type === NotionPropertyType.title) {
      const titleProp = property as NotionTitleProp;
      const titleArray = titleProp.title as NotionTitle[];
      name = titleArray.at(0)?.plain_text ?? page.url;
    }
  });

  return name;
};

const getDatabaseName = (database: NotionDatabaseObject): string => {
  return database.title?.at(0)?.plain_text ?? database.url;
};

const createNotionApiClient = (): AxiosInstance => {
  return axios.create({
    baseURL: notionApiUrl,
    headers: {
      'Notion-Version': notionVersion,
      ...getAuthHeader(),
    },
  });
};

const getAuthHeader = (): { Authorization: string } => {
  return { Authorization: `Bearer ${localStorage.getItem(NOTION_TOKEN)}` };
};

const iterateResults = async (
  client: AxiosInstance,
  itemType: ItemType,
  items: NotionPageOrDatabaseObject[],
  start_cursor: string = '',
) => {
  const sort = {
    direction: 'descending',
    timestamp: 'last_edited_time',
  };

  const filter = {
    value: itemType,
    property: 'object',
  };

  const response = await client.post('search', {
    sort,
    filter,
    ...(start_cursor && { start_cursor }),
  });

  items.push(...response.data.results);

  if (response.data['has_more']) {
    console.log('fetching more results...');
    await iterateResults(client, itemType, items, response.data['next_cursor']);
  }
};

const sleep = async (seconds: number) => {
  await new Promise(r => setTimeout(r, seconds * 1000));
};
