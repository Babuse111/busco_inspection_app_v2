import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, Modal } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { uploadPhoto } from '../services/supabase';

const PhotoCapture = ({ visible, onClose, onPhotoTaken, title = "Take Photo" }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(CameraType.back);
  const [isPreview, setIsPreview] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const cameraRef = useRef();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
          skipProcessing: false,
        });
        setCapturedPhoto(photo);
        setIsPreview(true);
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Failed to take picture');
      }
    }
  };

  const savePhoto = async () => {
    if (!capturedPhoto) return;

    setIsUploading(true);
    try {
      // Save to device gallery (if permission available)
      try {
        await MediaLibrary.saveToLibraryAsync(capturedPhoto.uri);
        console.log('Photo saved to gallery');
      } catch (mediaError) {
        console.log('Could not save to gallery:', mediaError.message);
      }

      // Upload to Supabase cloud storage
      const uploadResult = await uploadPhoto(capturedPhoto.uri, `inspection_${Date.now()}.jpg`);
      
      if (uploadResult.success) {
        console.log('Photo uploaded to cloud:', uploadResult.data);
        
        // Notify parent component
        onPhotoTaken({
          uri: capturedPhoto.uri,
          cloudUrl: uploadResult.data.publicUrl,
          uploadData: uploadResult.data
        });

        Alert.alert('Success', 'Photo saved and uploaded successfully!');
      } else {
        throw new Error(uploadResult.error || 'Upload failed');
      }

      // Reset and close
      setCapturedPhoto(null);
      setIsPreview(false);
      onClose();
    } catch (error) {
      console.error('Error saving photo:', error);
      Alert.alert('Error', 'Failed to save photo');
    } finally {
      setIsUploading(false);
    }
  };

  const retakePhoto = () => {
    setIsPreview(false);
    setCapturedPhoto(null);
  };

  const flipCamera = () => {
    setType(
      type === CameraType.back
        ? CameraType.front
        : CameraType.back
    );
  };

  if (hasPermission === null) {
    return (
      <Modal visible={visible} animationType="slide">
        <View style={styles.container}>
          <Text>Requesting camera permission...</Text>
        </View>
      </Modal>
    );
  }

  if (hasPermission === false) {
    return (
      <Modal visible={visible} animationType="slide">
        <View style={styles.container}>
          <Text style={styles.errorText}>No access to camera</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.placeholder} />
        </View>

        {isPreview ? (
          <View style={styles.previewContainer}>
            <Image source={{ uri: capturedPhoto?.uri }} style={styles.preview} />
            <View style={styles.previewControls}>
              <TouchableOpacity style={styles.retakeButton} onPress={retakePhoto}>
                <Text style={styles.buttonText}>Retake</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.saveButton, isUploading && styles.disabledButton]} 
                onPress={savePhoto}
                disabled={isUploading}
              >
                <Text style={styles.buttonText}>
                  {isUploading ? 'Saving...' : 'Save Photo'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            <Camera style={styles.camera} facing={type} ref={cameraRef}>
              <View style={styles.cameraControls}>
                <TouchableOpacity style={styles.flipButton} onPress={flipCamera}>
                  <Text style={styles.flipButtonText}>🔄</Text>
                </TouchableOpacity>
              </View>
            </Camera>
            <View style={styles.captureContainer}>
              <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  flipButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flipButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  captureContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'white',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  previewContainer: {
    flex: 1,
  },
  preview: {
    flex: 1,
  },
  previewControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  retakeButton: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  saveButton: {
    backgroundColor: '#51cf66',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  disabledButton: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default PhotoCapture;