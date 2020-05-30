import React from 'react'
import { connect } from 'react-redux'
import TestModal from './TestModal'
import LoginModal from './LoginModal'
import RegisterModal from './RegisterModal';
import UnauthModal from './UnauthModal'

const modalLookup = 
{
    TestModal,
    LoginModal,
    RegisterModal,
    UnauthModal
}

const mapStateToProps = state => 
{
    // console.log("modalManager.jsx : ",state);

    return (
    {
        currentModal: state.modals
    });
}

const ModalManager = ({ currentModal }) => 
{ 
    let renderedModal;

    // console.log("currentModal (ModalManager.jsx) : ",currentModal);

    if(currentModal) 
    {
        const {modalType, modalProps} = currentModal;
        const ModalComponent = modalLookup[modalType];

        renderedModal = <ModalComponent { ...modalProps }/>;
    }

    return <span>{ renderedModal }</span>
}

export default connect(mapStateToProps)(ModalManager);