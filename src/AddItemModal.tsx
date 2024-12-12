import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { addNewItem } from './fetch';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddItemModal = ({ isOpen, onClose }: ModalProps) => {

  const handleSubmitItemForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    console.log('got formData', formData)
    const quantity = parseInt(formData.get('quantity') as string, 10);
    const newItem = {
      width: parseInt(formData.get('width') as string, 10),
      height: parseInt(formData.get('height') as string, 10),
      depth: parseInt(formData.get('depth') as string, 10),
      location: formData.get('location') as string,
      origin: formData.get('origin') as string,
      packaging: formData.get('packaging') as string,
      notes: formData.get('notes') as string,
    };
    console.log('new item', newItem);
    for (let i = 0; i < quantity; i++) {
      await addNewItem(newItem);
      console.warn('added a canvas!')
    }
    onClose();
  }

  return (
    <div className={`modal-overlay${isOpen ? ' active' : ''}`} onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <header>New Blank Canvas</header>
        <form onSubmit={handleSubmitItemForm}>
          <div className='form-row multi'>
            <div className='input-column'>
              <label htmlFor='width' className='input-label'>Width</label>
              <input name='width' id='width' type='number' min='0'></input>
            </div>
            <div className='input-column'>
              <label htmlFor='height' className='input-label'>Height</label>
              <input name='height' id='height' type='number' min='0'></input>
            </div>
            <div className='input-column'>
              <label htmlFor='depth' className='input-label'>Depth</label>
              <input name='depth' id='depth' type='number' step={0.125} min={0}></input>
            </div>
          </div>
          <div className='form-row'>
          </div>
          <div className='form-row'>
            <label htmlFor='location' className='input-label'>Location</label>
            <input name='location' id='location' type='text'></input>
          </div>
          <div className='form-row'>
            <label htmlFor='origin' className='input-label'>Origin</label>
            <input name='origin' id='origin' type='text'></input>
          </div>
          <div className='form-row'>
            <label htmlFor='packaging' className='input-label'>Packaging</label>
            <input name='packaging' id='packaging' type='text'></input>
          </div>
          <div className='form-row'>
            <label htmlFor='notes' className='input-label'>Notes</label>
            <textarea name='notes' id='notes' rows={4}></textarea>
          </div>
          <div className='form-row'>
            <label htmlFor='quantity' className='input-label'>Quantity</label>
            <input type='number' name='quantity' id='quantity' defaultValue={1}></input>
          </div>
          <button type='submit' className={'save-button'}>Add to list</button>
        </form>
      </div>
    </div>)
};

export default AddItemModal;
