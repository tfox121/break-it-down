import axios from 'axios';
import { useState } from 'react';
import { useMutation } from 'react-query';
import {
  Form, Header, Input, Segment,
} from 'semantic-ui-react';

export default () => {
  const [task, setTask] = useState('');

  const taskMutation = useMutation((newTask) => axios.post(`${process.env.REACT_APP_SERVER}/tasks`, newTask));

  const addTaskResult = (mutation) => {
    <div>
      {mutation.isLoading ? (
        'Adding todo...'
      ) : (
        <>
          {mutation.isError ? (
            <div>
              An error occurred:
              {' '}
              {mutation.error.message}
            </div>
          ) : null}
          {mutation.isSuccess ? <div>Task added!</div> : null}
        </>
      )}
    </div>;
  };

  return (
    <Segment basic textAlign="center">
      <Header>Break It Down</Header>
      <Form
        onSubmit={() => {
          taskMutation.mutate({ id: new Date(), title: task });
          setTask('');
        }}
      >
        <Input
          placeholder="What's your task?"
          action={{
            icon: 'arrow right',
            color: 'green',
          }}
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        {addTaskResult(taskMutation)}
      </Form>
    </Segment>
  );
};
