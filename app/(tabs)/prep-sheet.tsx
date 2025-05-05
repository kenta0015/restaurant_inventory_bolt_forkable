import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import PrepSheetSummary from '../../components/PrepSheetSummary';
import PrepTaskItem from '../../components/PrepTaskItem';
import { prepTasksData } from '../../data/dummyData'; // ✅ Correct import

export default function PrepSheet() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState(prepTasksData ?? []); // ✅ SAFER: fallback to [] if undefined

  const handleTaskComplete = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? { ...task, isCompleted: !task.isCompleted }
          : task
      )
    );
  };

  const totalTime = tasks.reduce((acc, task) => acc + task.estimatedTime, 0);
  const completedTasks = tasks.filter(task => task.isCompleted).length;
  const totalTasks = tasks.length;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Today's Prep Sheet</Text>
        </View>

        <PrepSheetSummary
          totalTasks={totalTasks}
          completedTasks={completedTasks}
          totalTimeInMinutes={totalTime}
          selectedDate={selectedDate}
        />

        <View style={styles.tasksContainer}>
          <View style={styles.tasksHeader}>
            <Text style={styles.tasksTitle}>Tasks</Text>
            <Text style={styles.completion}>
              {totalTasks > 0
                ? `${Math.round((completedTasks / totalTasks) * 100)}% Complete`
                : '0% Complete'}
            </Text>
          </View>

          {tasks.map(task => (
            <PrepTaskItem
              key={task.id}
              task={task}
              onComplete={() => handleTaskComplete(task.id)}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  tasksContainer: {
    marginTop: 24,
  },
  tasksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tasksTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  completion: {
    fontSize: 16,
    color: '#fff',
    backgroundColor: '#8B0000',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
});
