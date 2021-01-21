import {
  Container,
} from 'semantic-ui-react';
import './App.scss';
import TaskInput from './TaskInput';
import TaskList from './TaskList';

const App = () => (
  <Container>
    <TaskInput />
    <TaskList />
  </Container>
);

export default App;
