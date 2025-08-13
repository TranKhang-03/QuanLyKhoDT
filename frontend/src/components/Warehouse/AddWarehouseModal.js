import React from 'react';

const AddWarehouseModal = ({currentWarehouse, setCurrentWarehouse, setShowAddForm, handleAddWarehouse, errorsName, errorsNote, setErrorsName, setErrorsNote}) => {
    return (
        <div className='overlay'>
            <div className='warehouse-area__add-form'>
                <h1 className='warehouse-area__add-form-banner'>Thêm khu vực kho</h1>
                <div className='warehouse-area__add-form-content'>
                    <div className='warehouse-area__form-item'>
                        <label className='warehouse-area__form-item-label' htmlFor="warehouse-name">Tên khu vực kho</label>
                        <input
                            className='warehouse-area__form-item-input'
                            type="text"
                            id='warehouse-name'
                            placeholder='Nhập tên khu vực kho'
                            value={currentWarehouse.name}
                            onChange={(e) => setCurrentWarehouse({ ...currentWarehouse, name: e.target.value })}
                        />
                        {errorsName && <p className='warehouse-form__alert-errors'>{errorsName}</p>}
                    </div>
                    <div className='warehouse-area__form-item'>
                        <label className='warehouse-area__form-item-label' htmlFor="warehouse-note">Ghi chú</label>
                        <input
                            className='warehouse-area__form-item-input'
                            type="text"
                            id='warehouse-note'
                            placeholder='Nhập ghi chú'
                            value={currentWarehouse.note}
                            onChange={(e) => setCurrentWarehouse({ ...currentWarehouse, note: e.target.value })}
                        />
                        {errorsNote && <p className='warehouse-form__alert-errors'>{errorsNote}</p>}
                    </div>
                    <div className='warehouse-area__form-buttons'>
                        <button className='warehouse-button confirm' onClick={handleAddWarehouse}>Lưu</button>
                        <button className='warehouse-button exit' onClick={() => {setShowAddForm(false); setErrorsName(''); setErrorsNote('')}}>Thoát</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddWarehouseModal;