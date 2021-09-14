import { ReactNode } from 'react';
import cx from 'classnames';

import '../styles/question.scss';

type QuestionProps = {
  content: string,
  author: {
    name: string,
    avatar: string,
  }
  children?: ReactNode,
  isAnswered?: boolean,
  isHighlighted?: boolean,
}

export function Question({ 
  content, 
  author, 
  isAnswered = false,
  isHighlighted = false,
  children }: QuestionProps) {
  return (
    //usar classe com nome dinamico para estilização condicional
    <div className={
      cx( //usar classnames em vez da notação {`question ${isAnswered ? 'aswered' : ''} ${isHighlighted ? 'highlighted' : ''}`}
        'question',
        { answered: isAnswered },
        { highlighted: isHighlighted && !isAnswered },
      )
      }>
      <p>{content}</p>
      <footer>
        <div className="user-info">
          <img src={author.avatar} alt={author.name} />
          <span>{author.name}</span>
        </div>
        <div>
          {children}
        </div>
      </footer>
    </div>
  );
}