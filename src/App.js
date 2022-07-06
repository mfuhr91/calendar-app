import './App.css';
import React, {useEffect, useState} from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid'
import Button from "react-bootstrap/Button";
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from "react-bootstrap/Modal";
import FormFloating from "react-bootstrap/FormFloating";
import InputGroup from "react-bootstrap/InputGroup";
import Alert from "react-bootstrap/Alert";

const API_URL = "https://calendar-api.mfuhr.com.ar/api"

export const App = () => {
    const [modalTitle, setModalTitle] = useState('Agregar Evento')
    const [eventsInfo, setEventsInfo] = useState({})
    const [id, setId] = useState('')
    const [title, setTitle] = useState('')
    const [date, setDate] = useState('')
    const [end, setEnd] = useState('')
    const [color, setColor] = useState(getRandomHexColorCode)
    const [showAddBtn, setShowAddBtn] = useState('')
    const [showUpdateBtn, setShowUpdateBtn] = useState('')
    const [showDeleteBtn, setShowDeleteBtn] = useState('')
    const [show, setShow] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [titleError, setTitleError] = useState('text-danger d-none')
    const [dateError, setDateError] = useState('text-danger d-none')
    const [endError, setEndError] = useState('text-danger d-none')

    useEffect(() => {
        getEvents().then((data) => {
            setEventsInfo(data)
        })
    }, [])

    const handleAddBtn = () => {
        setModalTitle('Agregar Evento')
        setShow(true)
        setColor(getRandomHexColorCode)
        setShowAddBtn('')
        setShowUpdateBtn('d-none')
        setShowDeleteBtn('d-none')
        clearForm()

    }

    const handleEventClick = (element) => {
        const event = element.event
        setShow(true)
        setModalTitle(event.title)
        setId(event.id)
        setTitle(event.title)
        setDate(event.startStr)
        setEnd(event.endStr)
        setColor(event.backgroundColor)
        setShowAddBtn('d-none')
        setShowDeleteBtn('')
        setShowUpdateBtn('')
        setFormState({
            id: event.id,
            title: event.title,
            date: event.startStr,
            end: event.endStr,
            color: event.backgroundColor
        })

    }


    const handleClose = () => {
        setShow(false);
        setShowConfirm(false)
        setTitleError('text-danger d-none')
        setDateError('text-danger d-none')
        setEndError('text-danger d-none')
        getEvents().then((data) => {
            setEventsInfo(data)
        })
    }

    const [formState, setFormState] = useState({})

    const onInputChange = ({target}) => {
        const value = target.value
        const name = target.name

        if ( name === 'id') setId(value)
        if ( name === 'title') setTitle(value)
        if ( name === 'date') setDate(value)
        if ( name === 'end') setEnd(value)
        if ( name === 'color') setColor(value)

        setFormState({
            ...formState,
            [name]:value
        })
    }

    const onSave = async () => {
        let data = {
            id,
            title,
            date,
            end,
            color
        }
        let ok = validateForm()

        if (!ok) {
            await saveEvent(data)
            getEvents().then((data) => {
                setEventsInfo(data)
            })
            setShow(false)
        }
    }

    const onDelete = async () => {
        await deleteEvent(id)
        getEvents().then((data) => {
            setEventsInfo(data)
        })
        setShowConfirm(false)
        setShow(false)
    }

    const onShowConfirm = () => {
        setShow(false)
        setShowConfirm(true)
    }


    const clearForm = () => {
        setId('')
        setTitle('')
        setDate('')
        setEnd('')
    }

    const validateForm = () => {
        let error = false
        if (title === '') {
            setTitleError('text-danger')
            error = true
        } else {
            setTitleError('text-danger d-none')
        }
        if (date === '') {
            setDateError('text-danger')
            error = true
        } else {
            setDateError('text-danger d-none')
        }
        if (end === '') {
            setEndError('text-danger')
            error = true
        } else {
            setEndError('text-danger d-none')
        }

        return error
    }

    return (

        <div className="App">

            <h1>Calendar APP</h1>
            <div className={'cal animate__animated animate__fadeIn'}>
                <FullCalendar
                    plugins={[dayGridPlugin]}
                    initialView="dayGridMonth"
                    contentHeight={'auto'}
                    locale={'es-AR'}
                    titleFormat={{month: 'short', year: 'numeric'}}
                    events={eventsInfo}
                    eventClick={handleEventClick}
                />
            </div>
            <Alert variant={'info'}>
                <i className={"fa-solid fa-circle-info me-1"}></i>
                Puede tocar un evento para editarlo o eliminarlo
            </Alert>
            <div>

                <Button variant="primary" onClick={handleAddBtn} className={'convertBtn'}>
                    <i className="convert-btn-icon fas fa-plus fa-2x"/>
                </Button>
            </div>

            <Modal backdrop={'static'} keyboard={false} show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input onChange={onInputChange} name="id" className={'d-none'} value={id}/>
                    <FormFloating className={'mb-3'}>
                        <input  onChange={onInputChange}
                                value={title}
                                type="text"
                                className={'form-control'}
                                id="eventTitle"
                                name="title"
                                placeholder="Título"
                                required={true}/>
                        <label className={'ms-3'} htmlFor="name">Título</label>
                        <span className={titleError}>El título no puede estar vacio</span>
                    </FormFloating>
                    <FormFloating className={'mb-3'}>
                        <input  onChange={onInputChange}
                                value={date}
                                type="date"
                                className={'form-control'}
                                id="dateSince"
                                name="date"
                                placeholder="Fecha desde"
                                required/>
                        <label className={'ms-3'} htmlFor="name">Fecha desde</label>
                        <span className={dateError}>El fecha no puede estar vacia</span>
                    </FormFloating>
                    <FormFloating className={'mb-3'}>
                        <input  onChange={onInputChange}
                                value={end}
                                type="date"
                                className={'form-control'}
                                id="dateTo"
                                name="end"
                                placeholder="Fecha hasta"
                                required/>
                        <label className={'ms-3'} htmlFor="name">Fecha hasta</label>
                        <span className={endError}>El fecha no puede estar vacia</span>
                    </FormFloating>
                    <InputGroup className={'mb-3'}>
                        <span className="input-group-text" id="basic-addon1">Color</span>
                        <input onChange={onInputChange}
                               value={color}
                               type="color"
                               name="color"
                               className="form-control form-control-color inputColor"/>
                    </InputGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button className={showAddBtn} onClick={onSave} variant={'primary'}>Agendar</Button>
                    <Button className={showUpdateBtn} onClick={onSave} variant={'primary'}>Actualizar</Button>
                    <Button className={showDeleteBtn} onClick={onShowConfirm} variant={'danger'}>Eliminar</Button>
                </Modal.Footer>
            </Modal>

            <Modal backdrop={'static'} keyboard={false} show={showConfirm} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Eliminar {title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    ¿Está seguro que desea eliminar el evento?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button className={showDeleteBtn} onClick={onDelete} variant={'danger'}>Eliminar</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}


const getEvents = async () => {
    const url = API_URL + '/events'
    const options = {
        port: 8080,
        method: 'GET',
    };
    const resp = await fetch(url, options)
    return await resp.json()
}


const getRandomHexColorCode = () => {
    let n = (Math.random() * 0xfffff * 1000000).toString(16);
    return '#' + n.slice(0, 6);
};


const saveEvent = async (value) => {
    const options = {
        port: 8080,
        method: 'POST',
        body: JSON.stringify(value)
    };

    console.log(value)
    if ( !value.id || value.id === '' ) {
        await fetch(API_URL + '/saveEvent', options)
    } else {
        await fetch(API_URL + '/updateEvent', options)
    }
}

const deleteEvent = async (id) => {

    const options = {
        port: 8080,
        method: 'POST',
        body: '{"id":"'+id+'"}'
    };

    await fetch(API_URL + '/deleteEvent', options)
}