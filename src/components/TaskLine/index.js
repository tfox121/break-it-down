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

  const newTaskSubmit = useMutation((newTask) => axios.post(`${process.env.REACT_APP_SERVER}/tasks`, newTask));

  const subTaskEdit = useMutation((editedTask) => axios.patch(
    `${process.env.REACT_APP_SERVER}/tasks/${editedTask.id}`,
    editedTask,
  ));

  const handleComplete = async () => {
    if (task.parentId) {
      const res = await fetch(`${process.env.REACT_APP_SERVER}/tasks/${task.parentId}`);
      const parentTask = await res.json();

      subTaskEdit.mutate({ ...parentTask, active: true });
    }
    subTaskEdit.mutate({ ...task, complete: true, active: false });
    setTimeout(() => {
      queryClient.invalidateQueries('taskData');
    }, 1000);
  };

  const handleSubmit = () => {
    newTaskSubmit.mutate({
      createdOn: new Date(),
      title: subTask,
      complete: false,
      children: [],
      ancestors: [...task.ancestors, task.id],
      parentId: task.id,
      active: true,
    });
    subTaskEdit.mutate({ ...task, children: [...task.children, subTask], active: false });
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
              {task.currentTask ? task.currentTask.title : task.title}
              <Header.Subheader>
                {timeAgo(
                  task.currentTask
                    ? task.currentTask.createdOn
                    : task.createdOn,
                )}
              </Header.Subheader>
            </Header.Content>
          </Header>
        </Table.Cell>
        <Table.Cell textAlign="right" width={3}>
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
      <Table.Row style={{ display: breakingDown ? 'table-row' : 'none' }}>
        <Table.Cell width={6}>
          <Form onSubmit={handleSubmit}>
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
        <Table.Cell width={6} />
        <Table.Cell />
      </Table.Row>
    </>
  );
};
