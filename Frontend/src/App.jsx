import './App.css'
import TaskCard from './Compontens/TaskCard'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { Plus } from 'lucide-react';
import axios from 'axios'
import { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import API from './axios';

function App() {

  const [data, setData] = useState([])
  const [task, setTask] = useState('')
  const [detail, setDetail] = useState('')
  const [status, setStatus] = useState('Panding')
  const [deadline, setDeadline] = useState('')
  const [show, setShow] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [isEditing, setIsEditing] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => {
    setEditingItem(null)
    setIsEditing(false)
    setTask('')
    setDetail('')
    setDeadline('')
    setStatus('Panding')
    setShow(true)
  }

  async function getData() {

    try {
      const res = await API.get('/')
      setData(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  async function addData(e) {
    e.preventDefault()
    try {
      await API.post('/add', { task, detail, deadline, status: status || 'Panding' })
      setTask('')
      setDetail('')
      setDeadline('')
      setStatus('Panding')
      handleClose()
      getData()
    } catch (err) {
      console.log(err)
    }
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setIsEditing(true)
    setTask(item.task || '')
    setDetail(item.detail || '')
    setDeadline(item.deadline || '')
    setStatus(item.status || 'Panding')
    setShow(true)
  }

  async function updateData(e) {
    e.preventDefault()
    if (!editingItem) return

    try {
      await API.put(`/update/${editingItem._id}`, {
        task,
        detail,
        deadline,
        status: status || editingItem.status || 'Panding'
      })
      setEditingItem(null)
      setIsEditing(false)
      setTask('')
      setDetail('')
      setDeadline('')
      setStatus('Panding')
      handleClose()
      getData()
    } catch (err) {
      console.log(err)
    }
  }

  async function deleteData(id) {
    try {
      await API.delete(`/delete/${id}`)
      getData()
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <>
      <Navbar expand="lg" className="navbar-custom">
        <Container>
          <Navbar.Brand href="#home">Student Task Manager</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link className='btn btn-outline-primary' onClick={handleShow}><Plus size={25} /> Add Task</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className='fw-bold fs-4'>{isEditing ? 'Update Task' : 'Add Task'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Task :</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Task"
                value={task}
                onChange={(e) => { setTask(e.target.value) }}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Detail :</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter detail"
                value={detail}
                onChange={(e) => { setDetail(e.target.value) }}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicStatus">
              <Form.Label>Status :</Form.Label>
              <Form.Select
                value={status}
                onChange={(e) => { setStatus(e.target.value) }}
              >
                <option value="Panding">Panding</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Deadline :</Form.Label>
              <Form.Control
                type="date"
                value={deadline}
                onChange={(e) => { setDeadline(e.target.value); }}
              />
            </Form.Group>
            <Button
              variant="outline-primary"
              type="submit"
              onClick={isEditing ? updateData : addData}
            >
              {isEditing ? 'Update' : 'Submit'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <section className='task-section'>
        <div className='container m-4'>
          <div className='task-header'>
            <h3>Task & Assignments</h3>
          </div>
          <div className='task-grid'>
            {
              data.map((item) => (
                <TaskCard
                  key={item._id || item.id}
                  item={item}
                  onEdit={() => handleEdit(item)}
                  onDelete={() => deleteData(item._id || item.id)}
                />
              ))
            }
          </div>
        </div>
      </section>
    </>
  )
}

export default App
