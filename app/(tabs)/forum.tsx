
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { commonStyles, colors, buttonStyles } from '../../styles/commonStyles';
import { useApp } from '../../contexts/AppContext';
import { voiceService } from '../../services/voiceService';
import { Button } from '../../components/button';
import { MOCK_FORUM_POSTS } from '../../data/mockData';
import { ForumPost } from '../../types';
import { t } from '../../utils/translations';

export default function ForumScreen() {
  const { state } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [posts, setPosts] = useState<ForumPost[]>(MOCK_FORUM_POSTS);

  const categories = ['All', 'General', 'Coconut', 'Paddy', 'Rubber', 'Tea', 'Coffee', 'Spices'];

  const filteredPosts = posts.filter(post => {
    if (selectedCategory === 'All') return true;
    return post.category === selectedCategory;
  });

  const handleCreatePost = () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      Alert.alert('Error', 'Please provide both title and content');
      return;
    }

    if (!state.user) {
      Alert.alert('Error', 'Please log in to create a post');
      return;
    }

    const newPost: ForumPost = {
      id: Date.now().toString(),
      userId: state.user.id,
      userName: state.user.name,
      userScore: state.user.score,
      title: newPostTitle.trim(),
      content: newPostContent.trim(),
      category: selectedCategory === 'All' ? 'General' : selectedCategory,
      createdAt: new Date(),
      replies: [],
      likes: 0,
      hasPhoto: false,
    };

    setPosts([newPost, ...posts]);
    setNewPostTitle('');
    setNewPostContent('');
    setShowNewPost(false);
    
    // Audio feedback always in Malayalam
    voiceService.speak('പോസ്റ്റ് സൃഷ്ടിച്ചു', 'ml');
  };

  const handleVoiceDictation = () => {
    // Audio always in Malayalam
    voiceService.speak('വോയ്സ് ഡിക്ടേഷൻ ആരംഭിക്കുക', 'ml');
    Alert.alert(
      'Voice Dictation',
      'This feature is coming soon. Please type for now.',
      [{ text: 'OK' }]
    );
  };

  const getUserRole = (userScore: number) => {
    if (userScore >= 500) {
      return state.language.code === 'ml' ? 'മെന്റർ' : 'Mentor';
    }
    return state.language.code === 'ml' ? 'അംഗം' : 'Member';
  };

  const getRoleColor = (userScore: number) => {
    if (userScore >= 500) return colors.accent;
    return colors.grey;
  };

  return (
    <View style={commonStyles.wrapper}>
      <View style={styles.header}>
        <Text style={[commonStyles.title, styles.title]}>{t('forum', state.language)}</Text>
      </View>

      {/* Category Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainer}
        contentContainerStyle={styles.categoryContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.activeCategoryButton,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.activeCategoryText,
              ]}
            >
              {category === 'All' ? (state.language.code === 'ml' ? 'എല്ലാം' : 'All') : category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* New Post Button */}
      <View style={styles.newPostContainer}>
        <Button
          onPress={() => setShowNewPost(!showNewPost)}
          style={[buttonStyles.primaryButton, styles.newPostButton]}
        >
          <Text style={styles.buttonText}>
            {showNewPost ? t('cancel', state.language) : '+ New Post'}
          </Text>
        </Button>
      </View>

      {/* New Post Form */}
      {showNewPost && (
        <View style={[commonStyles.card, styles.newPostForm]}>
          <Text style={styles.formTitle}>{t('createPost', state.language)}</Text>
          
          <TextInput
            style={commonStyles.input}
            value={newPostTitle}
            onChangeText={setNewPostTitle}
            placeholder={t('postTitle', state.language)}
            placeholderTextColor={colors.grey}
          />
          
          <TextInput
            style={[commonStyles.input, styles.contentInput]}
            value={newPostContent}
            onChangeText={setNewPostContent}
            placeholder={t('postContent', state.language)}
            placeholderTextColor={colors.grey}
            multiline
            numberOfLines={4}
          />
          
          <View style={styles.formActions}>
            <TouchableOpacity 
              style={styles.voiceButton}
              onPress={handleVoiceDictation}
            >
              <Text style={styles.voiceIcon}>🎤</Text>
              <Text style={styles.voiceButtonText}>{t('useMicrophone', state.language)}</Text>
            </TouchableOpacity>
            
            <Button
              onPress={handleCreatePost}
              style={[buttonStyles.primaryButton, styles.submitButton]}
            >
              <Text style={styles.buttonText}>Post</Text>
            </Button>
          </View>
        </View>
      )}

      {/* Posts List */}
      <ScrollView style={styles.postsContainer} showsVerticalScrollIndicator={false}>
        {filteredPosts.map((post) => (
          <View key={post.id} style={[commonStyles.card, styles.postCard]}>
            <View style={styles.postHeader}>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{post.userName}</Text>
                <View style={styles.userMeta}>
                  <Text style={[styles.userRole, { color: getRoleColor(post.userScore) }]}>
                    {getUserRole(post.userScore)}
                  </Text>
                  <Text style={styles.userScore}>• {post.userScore} {t('points', state.language)}</Text>
                </View>
              </View>
              <Text style={styles.postDate}>
                {new Date(post.createdAt).toLocaleDateString(state.language.code === 'ml' ? 'ml-IN' : 'en-US')}
              </Text>
            </View>

            <Text style={styles.postTitle}>{post.title}</Text>
            <Text style={styles.postContent}>{post.content}</Text>

            <View style={styles.postFooter}>
              <View style={styles.postStats}>
                <TouchableOpacity style={styles.statButton}>
                  <Text style={styles.statIcon}>👍</Text>
                  <Text style={styles.statText}>{post.likes}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.statButton}>
                  <Text style={styles.statIcon}>💬</Text>
                  <Text style={styles.statText}>{post.replies.length}</Text>
                </TouchableOpacity>
                {post.hasPhoto && (
                  <View style={styles.photoIndicator}>
                    <Text style={styles.photoIcon}>📷</Text>
                  </View>
                )}
              </View>
              <Text style={styles.categoryTag}>{post.category}</Text>
            </View>

            {/* Replies */}
            {post.replies.length > 0 && (
              <View style={styles.repliesContainer}>
                <Text style={styles.repliesTitle}>Replies:</Text>
                {post.replies.map((reply) => (
                  <View key={reply.id} style={styles.replyItem}>
                    <View style={styles.replyHeader}>
                      <Text style={styles.replyUserName}>{reply.userName}</Text>
                      <Text style={[styles.userRole, { color: getRoleColor(reply.userScore) }]}>
                        {getUserRole(reply.userScore)}
                      </Text>
                    </View>
                    <Text style={styles.replyContent}>{reply.content}</Text>
                    <View style={styles.replyFooter}>
                      <TouchableOpacity style={styles.replyLike}>
                        <Text style={styles.statIcon}>👍</Text>
                        <Text style={styles.statText}>{reply.likes}</Text>
                      </TouchableOpacity>
                      <Text style={styles.replyDate}>
                        {new Date(reply.createdAt).toLocaleDateString(state.language.code === 'ml' ? 'ml-IN' : 'en-US')}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}

        {filteredPosts.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>💬</Text>
            <Text style={styles.emptyText}>No posts in this category</Text>
            <Text style={styles.emptySubtext}>Create the first post!</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    marginBottom: 4,
  },
  categoryContainer: {
    maxHeight: 60,
    marginBottom: 20,
  },
  categoryContent: {
    paddingHorizontal: 20,
  },
  categoryButton: {
    backgroundColor: colors.card,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: colors.grey + '30',
  },
  activeCategoryButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  activeCategoryText: {
    color: 'white',
  },
  newPostContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  newPostButton: {
    paddingVertical: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  newPostForm: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  contentInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  voiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent + '20',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  voiceIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  voiceButtonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  submitButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  postsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  postCard: {
    marginBottom: 16,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userRole: {
    fontSize: 12,
    fontWeight: '600',
  },
  userScore: {
    fontSize: 12,
    color: colors.grey,
    marginLeft: 4,
  },
  postDate: {
    fontSize: 12,
    color: colors.grey,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  postContent: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 22,
    marginBottom: 16,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  statText: {
    fontSize: 14,
    color: colors.grey,
  },
  photoIndicator: {
    marginRight: 16,
  },
  photoIcon: {
    fontSize: 16,
  },
  categoryTag: {
    backgroundColor: colors.primary + '20',
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  repliesContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.grey + '30',
  },
  repliesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  replyItem: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  replyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  replyUserName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginRight: 8,
  },
  replyContent: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 8,
  },
  replyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  replyLike: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  replyDate: {
    fontSize: 12,
    color: colors.grey,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.grey,
  },
});
