import { Link, useHistory } from 'react-router-dom';
import { FormEvent, useState } from 'react'

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';

import { Button } from '../components/Button';
import { RoomList } from '../components/RoomList';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';

import '../styles/auth.scss';

export function NewRoom() {
  const { user } = useAuth();
  const history = useHistory();
  const roomRef = database.ref('rooms');

  const [ newRoom, setNewRoom ] = useState('');

  console.log(roomRef.get())
  async function handleCreateRoom(event: FormEvent){
    
    event.preventDefault();

    if(newRoom.trim() === ''){
      return;
    }

    const firebaseRoom = await roomRef.push({
      title: newRoom,
      author: user?.id,
    })

    history.push(`/rooms/${firebaseRoom.key}`)
  }


  return (
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
        <strong>Olá, {user?.name}!</strong>
        <p>Vamos juntos organizar e esclarecer as dúvidas de seu público!</p>
      </aside> 
      <main> 
        <div className="main-content">
          <img src={logoImg} alt="Letmeask" />
          <h2>Criar uma nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <input
              type="text"
              placeholder="Nome da sala"
              onChange={event => setNewRoom(event.target.value)}
              value={newRoom}
            />
            <Button type="submit">
              Criar sala
            </Button>
          </form>
          <p>
            Quer entrar em uma sala existente? <Link to="/">Clique aqui</Link>
          </p>
          <div className="separator">ou acesse uma de suas salas</div>
          <RoomList />  
        </div>
        
      </main>
    
    </div>
  )
}