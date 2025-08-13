import React from 'react';

const EditWarehouseModal = ({currentWarehouse, setCurrentWarehouse, setShowEditForm, handleEditWarehouse, errorsName, errorsNote, setErrorsName, setErrorsNote}) => {
    return (
        <div className='overlay'>
            <div className='warehouse-area__edit-form'>
                <h1 className='warehouse-area__edit-form-banner'>Thông tin khu vực kho</h1>
                <div className='warehouse-area__edit-form-content'>
                    <div className='warehouse-area__form-item'>
                        <label className='warehouse-area__form-item-label' htmlFor="warehouse-name_edit">Tên khu vực kho</label>
                        <input
                            className='warehouse-area__form-item-input'
                            type="text"
                            id='warehouse-name_edit'
                            placeholder='Nhập tên khu vực kho'
                            value={currentWarehouse.name}
                            onChange={(e) => setCurrentWarehouse({ ...currentWarehouse, name: e.target.value })}
                        />
                        {errorsName && <p className='warehouse-form__alert-errors'>{errorsName}</p>}
                    </div>
                    <div className='warehouse-area__form-item'>
                        <label className='warehouse-area__form-item-label' htmlFor="warehouse-note_edit">Ghi chú</label>
                        <input
                            className='warehouse-area__form-item-input'
                            type="text"
                            id='warehouse-note_edit'
                            placeholder='Nhập ghi chú'
                            value={currentWarehouse.note}
                            onChange={(e) => setCurrentWarehouse({ ...currentWarehouse, note: e.target.value })}
                        />
                        {errorsNote && <p className='warehouse-form__alert-errors'>{errorsNote}</p>}
                    </div>
                    <div className='warehouse-area__form-buttons'>
                        <button className='warehouse-button confirm' onClick={handleEditWarehouse}>Lưu</button>
                        <button className='warehouse-button exit' onClick={() => {setShowEditForm(false);setErrorsName(''); setErrorsNote('')}}>Thoát</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditWarehouseModal;