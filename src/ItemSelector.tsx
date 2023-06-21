import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Autocomplete, Box, IconButton, ListItem, ListItemAvatar, ListItemText, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import NotionIcon from './NotionIcon';
import { CACHED_ITEM } from './consts';
import { ItemType, NotionPageOrDatabaseObject } from './types';
import { fetchNotionItemsByType, getName, parseFromLocalStorage } from './utils/notion-utils';

interface ItemSelectorProps {
  item: NotionPageOrDatabaseObject;
  setItem: (item: NotionPageOrDatabaseObject) => void;
  itemType: ItemType;
  selectorType: string;
}

export default function ItemSelector(props: ItemSelectorProps) {
  const [notionItems, setNotionItems] = useState<NotionPageOrDatabaseObject[]>(
    parseFromLocalStorage(`${CACHED_ITEM}-${props.itemType}`) ?? [],
  );

  useEffect(() => {
    const fetchItems = async () => {
      const items = await fetchNotionItemsByType(props.itemType);
      localStorage.setItem(`${CACHED_ITEM}-${props.itemType}`, JSON.stringify(items));
      setNotionItems(items);
    };

    fetchItems();
  }, [props.itemType]);

  return (
    <>
      <Autocomplete
        fullWidth
        value={props.item}
        onChange={(event, item) => {
          if (!item) return;
          console.log(`Selected Item: ${JSON.stringify(item)}`);
          props.setItem(item);
        }}
        disablePortal
        id="notion-item-combo-box"
        options={notionItems}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={option => getName(option) ?? ''}
        sx={{ width: 300 }}
        renderOption={(props, option) => (
          <ListItem {...props} key={option.id} disablePadding>
            <ListItemAvatar>
              <NotionIcon iconProp={option.icon} />
            </ListItemAvatar>
            <ListItemText primary={getName(option)} />
            <IconButton href={option.url} target="_blank">
              <OpenInNewIcon />
            </IconButton>
          </ListItem>
        )}
        renderInput={params => (
          <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
            <NotionIcon iconProp={props.item.icon} />
            <TextField
              {...params}
              fullWidth
              label={`Selected ${props.itemType}`}
              variant="standard"
              inputProps={{
                ...params.inputProps,
              }}
            />
          </Box>
        )}
      />
    </>
  );
}
