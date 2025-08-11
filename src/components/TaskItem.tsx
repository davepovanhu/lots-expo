// src/components/TaskItem.tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Checkbox, IconButton, Text } from 'react-native-paper';
import type { Task } from '../models/Task';
import TaskStore from '../stores/TaskStore';
import { observer } from 'mobx-react-lite';

type Props = {
  task: Task;
};

function TaskItemBase({ task }: Props) {
  const toggle = async () => {
    try {
      await TaskStore.updateTask(task.id!, { completed: !task.completed });
    } catch (e) {
      console.error('Update failed', e);
    }
  };

  const remove = async () => {
    try {
      await TaskStore.deleteTask(task.id!);
    } catch (e) {
      console.error('Delete failed', e);
    }
  };

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={task.completed ? styles.completed : styles.title}>{task.title}</Text>
          {task.description ? <Text variant="bodySmall">{task.description}</Text> : null}
        </View>
        <Checkbox status={task.completed ? 'checked' : 'unchecked'} onPress={toggle} />
        <IconButton icon="delete" onPress={remove} />
      </Card.Content>
    </Card>
  );
}

export default observer(TaskItemBase);

const styles = StyleSheet.create({
  card: { marginVertical: 6 },
  row: { flexDirection: 'row', alignItems: 'center' },
  title: { fontSize: 16 },
  completed: { fontSize: 16, textDecorationLine: 'line-through', color: 'gray' },
});
