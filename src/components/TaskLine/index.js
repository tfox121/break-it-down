import axios from 'axios';
import Identicon from 'identicon.js';
import { useState } from 'react';
import { useMutation } from 'react-query';
import {
  Button, Form, Header, Image, Input, Table,
} from 'semantic-ui-react';

import md5 from '../utils/md5.min';
import timeAgo from '../utils/timeAgo';
import queryClient from '../../queryClient';

export default ({ task }) => {
  const [subTask, setSubTask] = useState('');
  const [breakingDown, setBreakingDown] = useState(false);

  const hash = md5(task.title);
  const icon = new Identicon(hash, 420).toString();

  const subTaskEdit = useMutation((editedTask) => axios.put(`${process.env.REACT_APP_SERVER}/tasks/${task.id}`, editedTask));

  const taskComplete = useMutation(() => axios.delete(`${process.env.REACT_APP_SERVER}/tasks/${task.id}`));

  const handleComplete = async () => {
    if (task.parentTask) {
      subTaskEdit.mutate(task.parentTask);
    } else {
      taskComplete.mutate();
    }
    setTimeout(() => {
      queryClient.invalidateQueries('taskData');
    }, 1000);
  };

  const handleSubmit = () => {
    subTaskEdit.mutate({ title: subTask, parentTask: task });
    setTimeout(() => {
      queryClient.invalidateQueries('taskData');
    }, 1000);
    setSubTask('');
    setBreakingDown(false);
  };

  return (
    <>
      <Table.Row key={task.id}>
        <Table.Cell width={12}>
          <Header as="h4" image>
            <Image src={`data:image/png;base64,${icon}`} rounded size="mini" />
            <Header.Content>
              {task.title}
              <Header.Subheader>{timeAgo(task.id)}</Header.Subheader>
            </Header.Content>
          </Header>
        </Table.Cell>
        <Table.Cell textAlign="right" width={breakingDown ? 1 : 3}>
          {breakingDown ? (
            <>
              <Button
                color="red"
                icon="cancel"
                onClick={() => setBreakingDown(false)}
              />
            </>
          ) : (
            <Button
              content="Break It Down!"
              color="red"
              onClick={() => setBreakingDown(true)}
            />
          )}
        </Table.Cell>
        <Table.Cell width={1}>
          <Button icon="check" color="green" onClick={handleComplete} />
        </Table.Cell>
      </Table.Row>
      <Table.Row style={{ display: breakingDown ? 'block' : 'none' }}>
        <Table.Cell width={16}>
          <Form
            onSubmit={handleSubmit}
          >
            <Input
              placeholder="What's the next step...?"
              action={{
                icon: 'arrow right',
                color: 'green',
              }}
              value={subTask}
              onChange={(e) => setSubTask(e.target.value)}
            />
          </Form>
        </Table.Cell>
      </Table.Row>
    </>
  );
};
