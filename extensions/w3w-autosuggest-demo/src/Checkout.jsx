import '@shopify/ui-extensions/preact';
import {render} from 'preact';
import {useState} from 'preact/hooks';

export default function extension() {
  render(<Extension />, document.body);
}

function Extension() {
  const [note, setNote] = useState('');

  const handleNoteChange = async (event) => {
    const value = event.target.value;
    setNote(value);

    const result = await shopify.applyMetafieldChange({
      type: 'updateCartMetafield',
      metafield: {
        namespace: 'custom',
        key: 'customer_note',
        value: value,
        type: 'single_line_text_field',
      },
    });

    console.log('Metafield save result:', result);
  };

  return (
    <s-text-field
      label="Order Note"
      value={note}
      onChange={handleNoteChange}
    />
  );
}
