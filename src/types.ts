export enum Sender {
  React,
  Content,
}

export interface ChromeMessage {
  from: Sender;
  message: any;
}

export enum NotionPropertyType {
  title = 'title',
  multi_select = 'multi_select',
  date = 'date',
  select = 'select',
  rich_text = 'rich_text',
  status = 'status',
  url = 'url',
  number = 'number',
  last_edited_time = 'last_edited_time',
  created_time = 'created_time',
}

export enum ItemType {
  page = 'page',
  database = 'database',
}

export type DbPage = {
  title: string;
  content: string;
};

export type NotionItem = NotionPage | NotionDatabase;

export type NotionTitle = {
  type: string;
  text?: {};
  annotations?: {};
  href?: any;
  plain_text: string;
};

export type NotionPage = {
  object: ItemType.page;
  id: string;
  created_time: string;
  last_edited_time: string;
  parent?: {
    type: string;
    database_id?: string;
  };
  properties: NotionProperties;
  url: string;
};

export type NotionDatabase = {
  object: ItemType.database;
  id: string;
  created_time: string;
  last_edited_time: string;
  archived: boolean;
  title?: NotionTitle[];
  properties: NotionProperties;
  url: string;
};

export type NotionProperties = {
  [key: string]: NotionProp;
};

export type NotionProp = {
  id: string;
  type: NotionPropertyType;
  name?: string;
  title?: NotionTitle[] | {};
  select?: NotionSelect;
};

export type NotionSelect = {
  options: NotionSelectOption[];
};

export type NotionSelectOption = {
  id: string;
  name: string;
  color: string;
};

export type NotificationPayload = {
  Message: string;
  LinkName?: string;
  LinkUrl?: string;
};
