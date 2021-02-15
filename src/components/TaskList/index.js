import { useQuery } from 'react-query';
import {
  Segment, Table,
} from 'semantic-ui-react';
import TaskLine from '../TaskLine';

export default () => {
  const { isLoading, error, data } = useQuery('taskData', async () => {
    const res = await fetch(`${process.env.REACT_APP_SERVER}/tasks`);
    return res.json();
  });

  if (isLoading) {
    return 'Tasks Loading...';
  }

  if (error) {
    return 'Error fetching tasks, please reload page.';
  }

  return (
    <Segment textAlign="center">
      <Table basic="very">
        <Table.Body>
          {data.map((task) => {
            if (task.active) {
              return <TaskLine task={task} key={task.id} />;
            }
            return null;
          })}
        </Table.Body>
      </Table>
    </Segment>
  );
};
