import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Autocomplete, IconButton, ListItem, ListItemButton, ListItemText, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { ItemType, NotionItem } from './types';
import { fetchNotionItemsByType, getName } from './utils/notion-utils';

interface ItemSelectorProps {
  setItem: (item: NotionItem) => void;
  itemType: ItemType;
}

export default function ItemSelector(props: ItemSelectorProps) {
  const [notionItems, setNotionItems] = useState<NotionItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<NotionItem>({} as NotionItem);

  useEffect(() => {
    const fetchItems = async () => {
      const items = await fetchNotionItemsByType(props.itemType);
      setNotionItems(items);
      setSelectedItem(items[0]);
    };

    fetchItems();
  }, [props.itemType]);

  return (
    <>
      <Autocomplete
        fullWidth
        value={selectedItem}
        onChange={(event, item) => {
          if (!item) return;
          console.log(`Selected Item: ${JSON.stringify(item)}`);
          setSelectedItem(item);
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
            <ListItemButton>
              <ListItemText primary={getName(option)} />
            </ListItemButton>
            <IconButton href={option.url} target="_blank">
              <OpenInNewIcon />
            </IconButton>
          </ListItem>
        )}
        renderInput={params => (
          <TextField
            {...params}
            fullWidth
            label="Choose an item"
            inputProps={{
              ...params.inputProps,
            }}
          />
        )}
      />
    </>
  );
}
