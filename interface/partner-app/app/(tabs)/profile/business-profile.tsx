import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Camera, MapPin, Phone, Mail, Globe, Clock } from 'lucide-react-native';

export default function BusinessProfileScreen() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState('Spice Garden');
  const [email, setEmail] = useState('spicegarden@example.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [address, setAddress] = useState('123 Food Street, Bangalore');
  const [description, setDescription] = useState('Authentic home-cooked meals delivered to your doorstep. Specializing in North Indian and South Indian cuisine.');
  const [website, setWebsite] = useState('www.spicegarden.com');
  const [timing, setTiming] = useState('8:00 AM - 10:00 PM');
  const [isEditing, setIsEditing] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Business Profile</Text>
        <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
          <Text style={styles.editButton}>{isEditing ? 'Save' : 'Edit'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.imageSection}>
        <Image
          source={{ uri: 'https://images.pexels.com/photos/845457/pexels-photo-845457.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' }}
          style={styles.coverImage}
        />
        <TouchableOpacity style={styles.cameraButton}>
          <Camera size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Business Name</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.disabledInput]}
            value={businessName}
            onChangeText={setBusinessName}
            editable={isEditing}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address</Text>
          <View style={styles.inputWithIcon}>
            <Mail size={20} color="#666" />
            <TextInput
              style={[styles.iconInput, !isEditing && styles.disabledInput]}
              value={email}
              onChangeText={setEmail}
              editable={isEditing}
              keyboardType="email-address"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.inputWithIcon}>
            <Phone size={20} color="#666" />
            <TextInput
              style={[styles.iconInput, !isEditing && styles.disabledInput]}
              value={phone}
              onChangeText={setPhone}
              editable={isEditing}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Address</Text>
          <View style={styles.inputWithIcon}>
            <MapPin size={20} color="#666" />
            <TextInput
              style={[styles.iconInput, !isEditing && styles.disabledInput]}
              value={address}
              onChangeText={setAddress}
              editable={isEditing}
              multiline
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Website</Text>
          <View style={styles.inputWithIcon}>
            <Globe size={20} color="#666" />
            <TextInput
              style={[styles.iconInput, !isEditing && styles.disabledInput]}
              value={website}
              onChangeText={setWebsite}
              editable={isEditing}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Business Hours</Text>
          <View style={styles.inputWithIcon}>
            <Clock size={20} color="#666" />
            <TextInput
              style={[styles.iconInput, !isEditing && styles.disabledInput]}
              value={timing}
              onChangeText={setTiming}
              editable={isEditing}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.textArea, !isEditing && styles.disabledInput]}
            value={description}
            onChangeText={setDescription}
            editable={isEditing}
            multiline
            numberOfLines={4}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF6E9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#FFF',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#333',
  },
  editButton: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#FF9F43',
  },
  imageSection: {
    position: 'relative',
    height: 200,
    backgroundColor: '#F5F5F5',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  cameraButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#FF9F43',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#333',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
  },
  iconInput: {
    flex: 1,
    marginLeft: 12,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#333',
    height: 100,
    textAlignVertical: 'top',
  },
  disabledInput: {
    backgroundColor: '#F5F5F5',
    color: '#666',
  },
});