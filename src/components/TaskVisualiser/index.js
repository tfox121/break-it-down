import { useState } from 'react';
import {
  Dropdown, Grid, Header, Segment,
} from 'semantic-ui-react';

export default ({ tasks }) => {
  const [taskSelect, setTaskSelect] = useState(null);
  // const [currentParent, setCurrentParent] = useState(null);

  // const taskDepth = 0;
  const parentTasks = tasks.filter((task) => !task.parentId);
  const options = parentTasks.map((task) => ({
    key: task.id,
    text: task.title,
    value: task.id,
  }));

  // let taskArray = [];
  // let depth = 0;

  // let currentParent = null;
  // const taskTree = [];

  // const subTaskRender = (task, index) => {
  //   depth += 1;
  //   if (depth > 20) {
  //     return null;
  //   }
  //   if (task.parentId === currentParent) {
  //     console.log(task);
  //     taskArray.push(task);
  //     // return <Grid.Row>{task.title}</Grid.Row>;
  //   }
  //   if (index === tasks.length - 1) {
  //     // const tempTaskArray = [...taskArray];
  //     taskTree.push(taskArray);
  //     taskArray = [];
  //     taskTree.slice(-1)[0].forEach((subTask) => {
  //       if (!subTask.active) {
  //         currentParent = subTask.id;
  //         tasks.forEach(subTaskRender);
  //       }
  //     });
  //     // const width = Math.floor(16 / tempTaskArray.length);
  //     // return (
  //     //   <Grid.Row textAlign="center">
  //     //     {tempTaskArray.map((subTask) => {
  //     //       setCurrentParent(subTask.id);
  //     //       depth += 1;
  //     //       return (
  //     //         <>
  //     //           <Grid.Column width={width}>{subTask}</Grid.Column>
  //     //           {tasks.map(subTaskRender)}
  //     //         </>
  //     //       );
  //     //     })}
  //     //   </Grid.Row>
  //     // );
  //   }
  //   console.log({ taskTree });
  //   return null;
  // };
  const renderTree = (parentId) => {
    const childTasks = tasks.filter((task) => task.parentId === parentId);

    const width = Math.floor(16 / childTasks.length);

    return (
      <Grid celled>
        <Grid.Row>
          {childTasks.map((task) => (
            <Grid.Column key={task.id} width={width}>
              {task.title}
              {!task.active && renderTree(task.id)}
            </Grid.Column>
          ))}
        </Grid.Row>
      </Grid>
    );
  };

  return (
    <Segment>
      <Dropdown
        value={taskSelect}
        onChange={(e, { value }) => {
          setTaskSelect(value);
        }}
        placeholder="Select Task Tree"
        options={options}
        selection
      />
      {taskSelect && (
        <Segment basic textAlign="center">
          <Header>{options.filter((task) => (task.key === taskSelect))[0].text}</Header>
          {renderTree(taskSelect)}
        </Segment>
      )}
    </Segment>
  );
};
