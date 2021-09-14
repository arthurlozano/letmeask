import { useHistory, useParams } from 'react-router-dom';

import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';

import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
// import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';

import '../styles/room.scss';
import { database } from '../services/firebase';

type RoomParams = {
  id: string;
}

export function AdminRoom(){
  // const { user } = useAuth();
  const history = useHistory();
  const params = useParams<RoomParams>();
  const roomId = params.id;
 
  const { title, questions } = useRoom(roomId);

  async function handleEndRoom(){
    database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    })

    history.push('/');
  }

  async function handleDeleteQuestion(questionId:string) {
    if(window.confirm('Tem certeza que voce deseja excluir esta pergunta?')){
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }
  async function handleCheckQuestionAsAnswered(questionId:string) {
     await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
       isAnswered: true,
     });
  }
  async function handleHighlightQuestion(questionId:string, questionHighlight:boolean) {
    if(questionHighlight){
      await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
        isHighlighted: false,
      });  
    }else {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
        isHighlighted: true,
      });
  
    }
    
  }


  return (
    <div id="page-room">
      <header>
        <div className="content">
          <button onClick={() => {history.push('/')}}>
            <img src={logoImg} alt="Letmeask" />
          </button>
          <div>
            <Button onClick={() => history.push(`/rooms/${roomId}`)}>Modo Usuário</Button>
            <RoomCode code={roomId}/>
            <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
          </div>
        </div>
      </header>

      <main className="content">
        <div className="room-title">
          <h1>Sala {title}</h1>
          { questions.length > 0 && <div className="questionsCount"><span>{questions.length} { questions.length > 1 ? 'perguntas' : 'pergunta'}</span></div>}
          { Object.values(questions).filter(question => !question.isAnswered).length > 0 && <div className="unansweredCount"><span>{Object.values(questions).filter(question => !question.isAnswered).length} { Object.values(questions).filter(question => !question.isAnswered).length > 1 ? 'perguntas não respondidas' : 'pergunta não respondida'}</span></div>}
        </div>

        <div className="question-list">
          {questions.sort((a, b) => (b.isAnswered ? -1 : (b.isHighlighted ? 999999999 : b.likeCount)) - (a.isAnswered ? -1 : (a.isHighlighted ? 999999999 : a.likeCount)) ).map(question => {
            return(
              <Question 
                key={question.id}
                content={question.content}
                author={question.author}
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
              >
                {!question.isAnswered && (
                   <>
                    <button
                      type="button"
                      onClick={() => handleCheckQuestionAsAnswered(question.id)}
                    >
                      <img src={checkImg} alt="Marcar como respondida" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleHighlightQuestion(question.id, question.isHighlighted)}
                    >
                      <img src={answerImg} alt="Responder pergunta" />
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deleteImg} alt="Remover pergunta" />
                </button>
              </Question>
            )
          })}
        </div>
      </main>
    </div>
  );
}