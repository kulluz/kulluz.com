import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Documents } from '../api/documents';

export const List = ({query}) => {
    const list = useTracker(() => {
        return Documents.find(query).fetch();
      });
    
  return (
    <div>
      <ul>{list.map(
        li => <li key={li._id}>
          <a href={"#"} target="_blank">{JSON.stringify(li)}</a>
        </li>
      )}</ul>
    </div>
  );
};
