import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { database } from "../services/firebase";

type RoomListProps = {
  name: string | undefined,
  questions: number,
}

type FirebaseRooms = Record<string, {
  author: string,
  endedAt: Date | null;
  questions: Record<string, {
    author: {
      name: string,
      avatar: string,
    }
    content: string,
    isAnswered: boolean,
    isHighlighted: boolean,
    likes: Record<string, {
      authorId: string,
    }>
  }>
  title: string,
  
}>

type RoomsOwnedType = {
  id: string,
  author: string,
  title: string,
  questions: number,
}[]|null;

export function RoomList () {

  const { user } = useAuth();
  const [ oRooms, setORooms ] = useState<RoomsOwnedType>([]);
  const history = useHistory();
  

  useEffect(() => {
    if(user) {
      const roomsRef = database.ref("/rooms");

      roomsRef.on('value', roomsList => {
        const rooms: FirebaseRooms = roomsList.val();
        const parsedRoomsAuthors = Object.entries(rooms).map(([key, room]) => {
            return {
              id: key,
              endedAt: room.endedAt,
              author: room.author,
              title: room.title,
              questions: Object.values(room.questions ?? {}).filter(question => !question.isAnswered).length,
            }
        }).filter(room => !room.endedAt);

        const owner = parsedRoomsAuthors.filter(room => room.author.includes(`${user?.id}`))
        setORooms(owner);
        
      });

      return () => {
        roomsRef.off('value');
      }
    }

    
  }, [user?.id]);



  

  return (
    <>
    {oRooms?.sort((a, b) => (b.questions - a.questions)).map((room) => 
      <button className="salas" onClick={() => history.push(`/rooms/${room.id}`)} key={room.id}>
          <p>{ room.id }</p>
          <footer>
            <div className="user-info">
              {room.title}
            </div>
              { room.questions > 0 && 
                <div className="questions">
                  <span>{room.questions} { room.questions > 1 ? 'perguntas' : 'pergunta'}</span>
                </div> 
              }
          </footer>
      </button>
            
    )}
    </>

  )
}