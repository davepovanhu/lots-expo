// src/screens/HomeScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Keyboard } from 'react-native';
import { Appbar, TextInput, Button, FAB, Title, Paragraph } from 'react-native-paper';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import TaskStore from '../stores/TaskStore';
import TaskItem from '../components/TaskItem';
import type { Task } from '../models/Task';
import { observer } from 'mobx-react-lite';
import type { User } from 'firebase/auth';

export default observer(function HomeScreen({ user }: { user: User }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (user?.uid) {
      TaskStore.subscribeToTasks(user.uid);
    }
    return () => {
      TaskStore.unsubscribeTasks();
    };
  }, [user?.uid]);

  const addTask = async () => {
    if (!title.trim()) return;
    try {
      await TaskStore.createTask({
        title: title.trim(),
        description: description.trim() || undefined,
        completed: false,
        uid: user.uid,
      });
      setTitle('');
      setDescription('');
      Keyboard.dismiss();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Flashify - LOTS" />
        <Appbar.Action icon="logout" onPress={handleSignOut} />
      </Appbar.Header>

      <View style={styles.form}>
        <Title>Add Task</Title>
        <TextInput label="Title" value={title} onChangeText={setTitle} />
        <TextInput label="Description" value={description} onChangeText={setDescription} multiline style={{ marginTop: 8 }} />
        <Button mode="contained" onPress={addTask} style={{ marginTop: 10 }}>
          Create
        </Button>
      </View>

      <View style={styles.list}>
        {TaskStore.loading ? <Paragraph>Loading...</Paragraph> : null}
        <FlatList
          data={TaskStore.tasks.slice()} // mobx observable
          keyExtractor={(item) => item.id!}
          renderItem={({ item }) => <TaskItem task={item as Task} />}
          contentContainerStyle={{ paddingBottom: 120, paddingHorizontal: 12 }}
        />
      </View>

      <FAB style={styles.fab} icon="plus" onPress={() => { /* maybe open modal for advanced create */ }} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  form: { padding: 12 },
  list: { flex: 1, paddingHorizontal: 6 },
  fab: { position: 'absolute', right: 16, bottom: 24 },
});
