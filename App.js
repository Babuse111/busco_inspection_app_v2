import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image, ScrollView, TextInput, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { supabase, signUp, signIn, signOut, getDepots, getBuses } from './services/supabase';
import PhotoCapture from './components/PhotoCapture';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [selectedDepot, setSelectedDepot] = useState('');
  const [showDepotDropdown, setShowDepotDropdown] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [depots, setDepots] = useState([]);
  const [buses, setBuses] = useState([]);
  const [hasPermissions, setHasPermissions] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedPhotos, setCapturedPhotos] = useState([]);
  const [busNumber, setBusNumber] = useState('');
  const [checkedItems, setCheckedItems] = useState({});
  const [itemNotes, setItemNotes] = useState({});
  
  // Form states
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [createAccountForm, setCreateAccountForm] = useState({ 
    fullName: '', 
    email: '', 
    password: '',
    employeeId: '',
    role: 'driver'
  });

  // Initialize app on start
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      console.log('App initializing...');
      
      // Request camera and media library permissions with error handling
      try {
        const cameraPermission = await Camera.requestCameraPermissionsAsync();
        console.log('Camera permission:', cameraPermission.status);
        
        // For media library, handle the permission gracefully
        let mediaPermission = { status: 'granted' }; // Default to granted
        try {
          mediaPermission = await MediaLibrary.requestPermissionsAsync();
          console.log('Media library permission:', mediaPermission.status);
        } catch (mediaError) {
          console.log('Media library permission not available (Expo Go limitation):', mediaError.message);
        }
        
        setHasPermissions(cameraPermission.status === 'granted');
      } catch (permissionError) {
        console.log('Permission error:', permissionError.message);
        setHasPermissions(false);
      }
      
      // Load depots from Supabase (temporarily using fallback)
      // const { data: depotsData, error } = await getDepots();
      // if (error) {
      //   console.error('Error loading depots:', error);
      // } else {
      //   setDepots(depotsData || []);
      // }
      
      // Fallback depot data
      setDepots([
        { name: 'Buscor Mbombela Depot' },
        { name: 'Buscor Malelane Depot' },
        { name: 'Buscor Bhoga Depot' }
      ]);

      // Check if user is already signed in (temporarily disabled)
      // const { data: { session } } = await supabase.auth.getSession();
      // if (session) {
      //   setCurrentUser(session.user);
      //   setCurrentScreen('dashboard');
      // }
      
      console.log('App initialization complete');
    } catch (error) {
      console.error('Initialization error:', error);
      // Set fallback data even if there's an error
      setDepots([
        { name: 'Buscor Mbombela Depot' },
        { name: 'Buscor Malelane Depot' },
        { name: 'Buscor Bhoga Depot' }
      ]);
    }
  };

  // Authentication functions (simplified for testing)
  const handleSignIn = async (email, password) => {
    try {
      // Temporarily bypass Supabase authentication
      Alert.alert('Sign In', 'Bypassing authentication for testing');
      setCurrentUser({ email: email });
      setCurrentScreen('dashboard');
      console.log('User signed in (testing mode):', email);
      
      // Original Supabase code (commented out for testing):
      // const { data, error } = await signIn(email, password);
      // if (error) {
      //   Alert.alert('Sign In Failed', error.message);
      //   return;
      // }
      // if (data.user) {
      //   setCurrentUser(data.user);
      //   setCurrentScreen('dashboard');
      //   console.log('User signed in:', data.user.email);
      // }
    } catch (error) {
      console.error('Sign in error:', error);
      Alert.alert('Error', 'Sign in failed. Please try again.');
    }
  };

  const handleCreateAccount = async (fullName, email, password, employeeId, role) => {
    try {
      // Temporarily bypass Supabase account creation for testing
      Alert.alert('Success', `Account created for ${fullName}! You can now sign in.`);
      setCurrentScreen('driverLogin');
      console.log('Account created (testing mode):', { fullName, email, employeeId });
      
      // Original Supabase code (commented out for testing):
      // const userData = {
      //   full_name: fullName,
      //   employee_id: employeeId,
      //   role: role || 'driver'
      // };
      // const { data, error } = await signUp(email, password, userData);
      // if (error) {
      //   Alert.alert('Account Creation Failed', error.message);
      //   return;
      // }
      // if (data.user) {
      //   Alert.alert('Success', 'Account created successfully! Please check your email to verify your account.');
      //   setCurrentScreen('driverLogin');
      // }
    } catch (error) {
      console.error('Create account error:', error);
      Alert.alert('Error', 'Failed to create account. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        console.error('Logout error:', error);
      }
      setCurrentUser(null);
      setCurrentScreen('welcome');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Checkbox handling functions
  const toggleCheckbox = (itemName) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }));
  };

  const updateItemNote = (itemName, note) => {
    setItemNotes(prev => ({
      ...prev,
      [itemName]: note
    }));
  };

  const renderInspectionItem = (itemKey, title, description) => (
    <View key={itemKey} style={styles.preTripItem}>
      <View style={styles.preTripItemHeader}>
        <TouchableOpacity 
          style={[styles.checkbox, checkedItems[itemKey] && styles.checkboxChecked]}
          onPress={() => toggleCheckbox(itemKey)}
        >
          {checkedItems[itemKey] && <Text style={styles.checkboxTick}>✓</Text>}
        </TouchableOpacity>
        <Text style={styles.preTripItemLabel}>{title}</Text>
      </View>
      <Text style={styles.preTripDescription}>{description}</Text>
      <TextInput
        style={styles.preTripNotesInput}
        placeholder="Add notes/comments for issues"
        value={itemNotes[itemKey] || ''}
        onChangeText={(text) => updateItemNote(itemKey, text)}
        multiline
        numberOfLines={2}
      />
      <TouchableOpacity 
        style={styles.addPhotoButton}
        onPress={() => setShowCamera(true)}
      >
        <Text style={styles.addPhotoButtonText}>📷 Take Photo</Text>
      </TouchableOpacity>
    </View>
  );

  // Photo handling functions
  const handlePhotoTaken = (photoData) => {
    setCapturedPhotos(prev => [...prev, photoData]);
    console.log('Photo captured:', photoData);
  };

  const clearPhotos = () => {
    setCapturedPhotos([]);
  };

  const renderWelcomeScreen = () => (
    <SafeAreaView style={styles.landingContainer}>
      <StatusBar style="dark" />
      
      {/* Main content */}
      <View style={styles.landingContent}>
        {/* Buscor Logo (use provided PNG) */}
        <View style={styles.landingLogoContainer}>
          <Image
            source={require('./assets/buscor-logo.png')}
            style={styles.landingLogoImage}
            resizeMode="contain"
          />
        </View>

        {/* App title */}
        <Text style={styles.landingTitle}>Buscor Driver App</Text>
        <Text style={styles.landingSubtitle}>Your digital tool for daily tasks</Text>
        
        {/* Description */}
        <Text style={styles.landingDescription}>
          Drivers can complete pre-trip checks, report{'\n'}
          incidents, and upload photos directly from their{'\n'}
          phone.
        </Text>

        {/* Action buttons */}
        <View style={styles.landingButtonContainer}>
          <TouchableOpacity
            style={styles.signInButton}
            onPress={() => setCurrentScreen('driverLogin')}
          >
            <Text style={styles.signInButtonText}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.createAccountLandingButton}
            onPress={() => setCurrentScreen('adminLogin')}
          >
            <Text style={styles.createAccountLandingButtonText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );

  const renderAdminLogin = () => (
    <SafeAreaView style={styles.driverLoginContainer}>
      <View style={styles.driverLoginContent}>
        <Text style={styles.driverLoginTitle}>Create Account</Text>
        
        <View style={styles.driverLoginForm}>
          <View style={styles.driverInputGroup}>
            <Text style={styles.driverInputLabel}>Full Name</Text>
            <TextInput
              style={styles.driverTextInput}
              placeholder="Enter your name"
              value={createAccountForm.fullName}
              onChangeText={(text) => setCreateAccountForm({...createAccountForm, fullName: text})}
            />
          </View>

          <View style={styles.driverInputGroup}>
            <Text style={styles.driverInputLabel}>Email</Text>
            <TextInput
              style={styles.driverTextInput}
              placeholder="Enter your email"
              value={createAccountForm.email}
              onChangeText={(text) => setCreateAccountForm({...createAccountForm, email: text})}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.driverInputGroup}>
            <Text style={styles.driverInputLabel}>Employee/Driver ID</Text>
            <TextInput
              style={styles.driverTextInput}
              placeholder="Enter your Employee ID"
              value={createAccountForm.employeeId}
              onChangeText={(text) => setCreateAccountForm({...createAccountForm, employeeId: text})}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.driverInputGroup}>
            <Text style={styles.driverInputLabel}>Password</Text>
            <TextInput
              style={styles.driverTextInput}
              placeholder="Choose a password"
              value={createAccountForm.password}
              onChangeText={(text) => setCreateAccountForm({...createAccountForm, password: text})}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity 
            style={styles.createAccountSubmitButton}
            onPress={() => handleCreateAccount(
              createAccountForm.fullName, 
              createAccountForm.email, 
              createAccountForm.password,
              createAccountForm.employeeId,
              'driver'
            )}
          >
            <Text style={styles.driverSignInButtonText}>Create Account</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.driverBackButton}
            onPress={() => setCurrentScreen('welcome')}
          >
            <Text style={styles.driverBackButtonText}>← Back to Welcome</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );

  const renderDriverLogin = () => (
    <SafeAreaView style={styles.driverLoginContainer}>
      <View style={styles.driverLoginContent}>
        <Text style={styles.driverLoginTitle}>Driver Login</Text>
        
        <View style={styles.driverLoginForm}>
          <View style={styles.driverInputGroup}>
            <Text style={styles.driverInputLabel}>Email</Text>
            <TextInput
              style={styles.driverTextInput}
              placeholder="Enter your email"
              value={loginForm.email}
              onChangeText={(text) => setLoginForm({...loginForm, email: text})}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.driverInputGroup}>
            <Text style={styles.driverInputLabel}>Password</Text>
            <TextInput
              style={styles.driverTextInput}
              placeholder="Enter your password"
              value={loginForm.password}
              onChangeText={(text) => setLoginForm({...loginForm, password: text})}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity 
            style={styles.driverSignInButton}
            onPress={() => handleSignIn(loginForm.email, loginForm.password)}
          >
            <Text style={styles.driverSignInButtonText}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.driverBackButton}
            onPress={() => setCurrentScreen('welcome')}
          >
            <Text style={styles.driverBackButtonText}>← Back to Welcome</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );

  const renderDashboard = () => (
    <SafeAreaView style={styles.dashboardContainer}>
      <View style={styles.dashboardContent}>
        <Text style={styles.dashboardTitle}>Choose an Option</Text>
        
        <View style={styles.dashboardMenuContainer}>
          <TouchableOpacity 
            style={styles.dashboardMenuButton}
            onPress={() => setCurrentScreen('preTripInspection')}
          >
            <Text style={styles.dashboardMenuButtonText}>Inspection</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.dashboardMenuButtonOrange}
            onPress={() => setCurrentScreen('reportIncident')}
          >
            <Text style={styles.dashboardMenuButtonText}>Report Incident</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.dashboardMenuButton}
            onPress={() => alert('History - Coming Soon')}
          >
            <Text style={styles.dashboardMenuButtonText}>History</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.dashboardMenuButtonOrange}
            onPress={() => setCurrentScreen('clockInOut')}
          >
            <Text style={styles.dashboardMenuButtonText}>Clock In/Out</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.dashboardLogoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.dashboardLogoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );

  const renderClockInOut = () => (
    <SafeAreaView style={styles.clockInOutContainer}>
      <View style={styles.clockInOutHeader}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => setCurrentScreen('dashboard')}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.clockInOutContent}>
        <Text style={styles.clockInOutTitle}>Clock In / Clock Out</Text>
        
        <Text style={styles.clockInOutStatus}>Not clocked in</Text>
        
        <TouchableOpacity 
          style={styles.clockInButton}
          onPress={() => alert('Clock In functionality coming soon')}
        >
          <Text style={styles.clockInButtonText}>Clock In</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  const renderReportIncident = () => (
    <SafeAreaView style={styles.reportIncidentContainer}>
      <View style={styles.reportIncidentHeader}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => setCurrentScreen('dashboard')}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.reportIncidentContent}>
        <Text style={styles.reportIncidentTitle}>Report Incident</Text>
        
        <View style={styles.reportIncidentTextArea}>
          <Text style={styles.reportIncidentPlaceholder}>
            Describe the incident (e.g., accident, mechanical failure, road hazard, etc.).
          </Text>
        </View>
        
        <TouchableOpacity style={styles.addPhotoButton}>
          <Text style={styles.addPhotoButtonText}>Add Photo</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.submitIncidentButton}
          onPress={() => alert('Incident submitted successfully')}
        >
          <Text style={styles.submitIncidentButtonText}>Submit Incident</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  const renderPreTripInspection = () => (
    <SafeAreaView style={styles.preTripContainer}>
      <View style={styles.preTripHeader}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => setCurrentScreen('dashboard')}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.preTripScrollView} 
        contentContainerStyle={styles.preTripScrollContent}
        showsVerticalScrollIndicator={true}
      >
        <Text style={styles.preTripTitle}>Pre-Trip Inspection</Text>
        
        {/* Inspection Details Section */}
        <View style={styles.inspectionDetailsSection}>
          {/* Depot Name Dropdown */}
          <View style={styles.inspectionDetailField}>
            <Text style={styles.inspectionDetailLabel}>Depot Name</Text>
            <TouchableOpacity 
              style={styles.dropdownButton}
              onPress={() => setShowDepotDropdown(!showDepotDropdown)}
            >
              <Text style={styles.dropdownButtonText}>
                {selectedDepot || 'Select Depot'}
              </Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </TouchableOpacity>
            
            {/* Dropdown Options */}
            {showDepotDropdown && (
              <View style={styles.dropdownOptions}>
                {depots.map((depot, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.dropdownOption}
                    onPress={() => {
                      setSelectedDepot(depot.name || depot);
                      setShowDepotDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownOptionText}>{depot.name || depot}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Bus Number Field */}
          <View style={styles.inspectionDetailField}>
            <Text style={styles.inspectionDetailLabel}>Bus Number</Text>
            <TextInput
              style={styles.busNumberInput}
              placeholder="Enter bus number (e.g., BUSCOR001)"
              value={busNumber}
              onChangeText={setBusNumber}
              autoCapitalize="characters"
            />
          </View>
        </View>
        
        {/* Inspection Checklist Items */}
        {renderInspectionItem('waterLevel', 'Water Level', 'Water level correct on dash')}
        {renderInspectionItem('tyres', 'Tyres', 'Tyres in good condition')}
        {renderInspectionItem('waterInGlass', 'Water in Glass', 'No water in separator glass')}
        {renderInspectionItem('dieselCap', 'Diesel Cap', 'Diesel cap fastened')}
        {renderInspectionItem('allGauges', 'All Gauges', 'All gauges/calibration OK')}
        {renderInspectionItem('windows', 'Windows', 'All windows glass OK')}
        {renderInspectionItem('steering', 'Steering', 'Steering system OK')}
        {renderInspectionItem('fireExtinguisher', 'Fire Extinguisher', 'Fire extinguisher/triangle OK')}
        {renderInspectionItem('hooter', 'Hooter', 'Hooter OK')}
        {renderInspectionItem('lights', 'Lights', 'Lights OK')}
        {renderInspectionItem('destinationBoard', 'Destination Board', 'Destination board OK')}
        {renderInspectionItem('validLicense', 'Valid License', 'Valid license/permit/exemption')}
        {renderInspectionItem('bellowsTurntable', 'Bellows/Turntable', 'Bellows/turntable OK')}
        {renderInspectionItem('rearMirror', 'Rear Mirror', 'Rear view mirrors/stands OK')}
        {renderInspectionItem('eTag', 'E-Tag', 'E-Tag installed')}
        {renderInspectionItem('busClean', 'Bus Clean', 'Bus properly cleaned')}
        {renderInspectionItem('plates', 'Plates', 'Both number plates present')}
        {renderInspectionItem('wiper', 'Wiper', 'Wipers and wiper blades OK')}
        {renderInspectionItem('fuelOilLeak', 'Fuel/Oil Leak', 'No fuel, oil, water leaks')}
        {renderInspectionItem('oilLevel', 'Oil Level', 'Oil level on dash OK')}
        {renderInspectionItem('wheelNuts', 'Wheel Nuts', 'All wheel nuts fitted/fastened')}
        {renderInspectionItem('airSystem', 'Air System', 'Air / system OK')}
        {renderInspectionItem('fuelTheft', 'Fuel Theft', 'No fuel theft suspected')}
        {renderInspectionItem('brakes', 'Brakes', 'Brakes OK')}
        {renderInspectionItem('sequence', 'Sequence', 'No sequence change')}
        {renderInspectionItem('cameras', 'Cameras', 'All cameras installed working')}
        {renderInspectionItem('secondFireExtinguisher', 'Second Fire Extinguisher', 'Second fire extinguisher')}
        {renderInspectionItem('bodyDamage', 'Body Damage', 'No new scratches / body damage')}
        {renderInspectionItem('ticketMachine', 'Ticket Machine', 'Ticket machine OK')}
        {renderInspectionItem('sparePaper', 'Spare Paper', 'Spare paper roll present')}
        {renderInspectionItem('answers', 'Answers', 'Ensure answers are correct')}

        {/* Display captured photos */}
        {capturedPhotos.length > 0 && (
          <View style={styles.photosContainer}>
            <Text style={styles.photosTitle}>Captured Photos ({capturedPhotos.length})</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {capturedPhotos.map((photo, index) => (
                <Image
                  key={index}
                  source={{ uri: photo.uri }}
                  style={styles.capturedPhoto}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Submit Button */}
        <TouchableOpacity 
          style={styles.submitInspectionButton}
          onPress={() => {
            const checkedCount = Object.values(checkedItems).filter(Boolean).length;
            const noteCount = Object.values(itemNotes).filter(note => note && note.trim()).length;
            alert(`Pre-Trip Inspection submitted successfully!\n\nItems checked: ${checkedCount}/31\nNotes added: ${noteCount}\nPhotos: ${capturedPhotos.length}`);
            // Clear data after submission
            setCheckedItems({});
            setItemNotes({});
            setCapturedPhotos([]);
          }}
        >
          <Text style={styles.submitInspectionButtonText}>Submit Inspection</Text>
        </TouchableOpacity>
        </ScrollView>
    </SafeAreaView>
  );

  const renderInspectionScreen = () => (
    <SafeAreaView style={styles.container}>
      {/* Step Progress Header */}
      <View style={styles.stepHeader}>
        <View style={styles.stepRow}>
          <View style={styles.stepContainer}>
            <View style={[styles.stepCircle, styles.activeStep]}>
              <Text style={styles.activeStepText}>1</Text>
            </View>
            <Text style={styles.stepLabel}>Inspection Info</Text>
          </View>
          <View style={styles.stepContainer}>
            <View style={styles.stepCircle}>
              <Text style={styles.stepText}>2</Text>
            </View>
            <Text style={styles.stepLabel}>Do Inspection</Text>
          </View>
          <View style={styles.stepContainer}>
            <View style={styles.stepCircle}>
              <Text style={styles.stepText}>3</Text>
            </View>
            <Text style={styles.stepLabel}>Summary</Text>
          </View>
        </View>
      </View>

      {/* Inspection Form */}
      <View style={styles.inspectionForm}>
        <Text style={styles.inspectionTitle}>New Inspection</Text>
        
        {/* Report Number */}
        <View style={styles.reportRow}>
          <Text style={styles.reportLabel}>Report#</Text>
          <Text style={styles.reportNumber}>BUS1001</Text>
        </View>

        {/* Location Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Location</Text>
          <View style={styles.inputBox}>
            <Text style={styles.inputPlaceholder}>Enter location</Text>
          </View>
        </View>

        {/* Inspector Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Inspector</Text>
          <View style={styles.inputBox}>
            <Text style={styles.inputPlaceholder}>Enter inspector name</Text>
          </View>
        </View>

        {/* Bus Selection */}
        <View style={styles.inputGroup}>
          <View style={styles.busHeader}>
            <Text style={styles.requiredLabel}>* Bus</Text>
            <TouchableOpacity>
              <Text style={styles.changeButton}>Change {'>'}</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.busCard}>
            <Text style={styles.busTitle}>NO63850237 - Sample Bus-5230</Text>
            <View style={styles.busDetails}>
              <Text style={styles.busDetail}>Category: Sample Category</Text>
              <Text style={styles.busDetail}>Model: 326F</Text>
              <Text style={styles.busDetail}>Meter Reading: 1025 Miles</Text>
              <Text style={styles.availableStatus}>Available</Text>
            </View>
          </View>
        </View>

        {/* Meter Reading */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Meter Reading</Text>
          <View style={styles.meterRow}>
            <View style={styles.meterInputBox}>
              <Text style={styles.meterValue}>1025</Text>
            </View>
            <Text style={styles.milesLabel}>Miles</Text>
          </View>
          <Text style={styles.currentMeter}>Current Meter Reading 1025</Text>
        </View>

        {/* GPS Location */}
        <View style={styles.inputGroup}>
          <View style={styles.gpsHeader}>
            <Text style={styles.inputLabel}>GPS Location</Text>
            <TouchableOpacity style={styles.locationButton}>
              <Text style={styles.locationButtonText}>📍 Get location</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={() => setCurrentScreen('welcome')}
        >
          <Text style={styles.cancelButtonText}>{'<'} CANCEL</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton}>
          <Text style={styles.nextButtonText}>NEXT {'>'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  // Render current screen with PhotoCapture overlay
  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'adminLogin':
        return renderAdminLogin();
      case 'driverLogin':
        return renderDriverLogin();
      case 'dashboard':
        return renderDashboard();
      case 'clockInOut':
        return renderClockInOut();
      case 'reportIncident':
        return renderReportIncident();
      case 'preTripInspection':
        return renderPreTripInspection();
      case 'inspection':
        return renderInspectionScreen();
      default:
        return renderWelcomeScreen();
    }
  };

  return (
    <>
      {renderCurrentScreen()}
      <PhotoCapture
        visible={showCamera}
        onClose={() => setShowCamera(false)}
        onPhotoTaken={handlePhotoTaken}
        title="Inspection Photo"
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  
  // Landing Page Styles
  landingContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  landingContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  landingLogoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  landingLogoImage: {
    width: 140,
    height: 140,
    marginBottom: 16,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FF8C00',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  logoInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#20B2AA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  companyName: {
    fontSize: 28,
    fontWeight: '300',
    color: '#20B2AA',
    letterSpacing: 1,
  },
  companySubtitle: {
    fontSize: 14,
    color: '#FF8C00',
    marginTop: 2,
    fontWeight: '300',
  },
  landingTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF8C00',
    marginBottom: 15,
    textAlign: 'center',
  },
  landingSubtitle: {
    fontSize: 18,
    color: '#666666',
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: '400',
  },
  landingDescription: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 50,
    fontWeight: '300',
  },
  landingButtonContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  signInButton: {
    backgroundColor: '#20B2AA',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 40,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  signInButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  createAccountLandingButton: {
    backgroundColor: '#FF8C00',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  createAccountLandingButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },

  // Driver Login Screen Styles
  driverLoginContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  driverLoginContent: {
    flex: 1,
    paddingHorizontal: 40,
    paddingTop: 100,
    alignItems: 'center',
  },
  driverLoginTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 60,
    textAlign: 'center',
  },
  driverLoginForm: {
    width: '100%',
  },
  driverInputGroup: {
    marginBottom: 25,
  },
  driverInputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 8,
  },
  driverInputBox: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#f9f9f9',
  },
  driverInputPlaceholder: {
    color: '#999999',
    fontSize: 16,
  },
  driverSignInButton: {
    backgroundColor: '#20B2AA',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 40,
    marginTop: 20,
    marginBottom: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  driverSignInButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  driverBackButton: {
    alignItems: 'center',
  },
  driverBackButtonText: {
    color: '#FF8C00',
    fontSize: 16,
    fontWeight: '500',
  },

  // Dashboard Screen Styles
  dashboardContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  dashboardContent: {
    flex: 1,
    paddingHorizontal: 40,
    paddingTop: 100,
    alignItems: 'center',
  },
  dashboardTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 60,
    textAlign: 'center',
  },
  dashboardMenuContainer: {
    width: '100%',
  },
  dashboardMenuButton: {
    backgroundColor: '#20B2AA',
    borderRadius: 25,
    paddingVertical: 18,
    paddingHorizontal: 40,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dashboardMenuButtonOrange: {
    backgroundColor: '#FF8C00',
    borderRadius: 25,
    paddingVertical: 18,
    paddingHorizontal: 40,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dashboardMenuButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  dashboardLogoutButton: {
    alignItems: 'center',
    marginTop: 20,
  },
  dashboardLogoutButtonText: {
    color: '#FF8C00',
    fontSize: 16,
    fontWeight: '500',
  },

  // Clock In/Out Screen Styles
  clockInOutContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  clockInOutHeader: {
    paddingTop: 20,
    paddingLeft: 20,
    paddingBottom: 10,
  },
  backButton: {
    paddingVertical: 10,
    paddingRight: 20,
  },
  backButtonText: {
    color: '#FF8C00',
    fontSize: 16,
    fontWeight: '500',
  },
  clockInOutContent: {
    flex: 1,
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clockInOutTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 60,
    textAlign: 'center',
  },
  clockInOutStatus: {
    fontSize: 18,
    color: '#666666',
    marginBottom: 60,
    textAlign: 'center',
  },
  clockInButton: {
    backgroundColor: '#FF8C00',
    borderRadius: 25,
    paddingVertical: 18,
    paddingHorizontal: 60,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  clockInButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },

  // Report Incident Screen Styles
  reportIncidentContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  reportIncidentHeader: {
    paddingTop: 20,
    paddingLeft: 20,
    paddingBottom: 10,
  },
  reportIncidentContent: {
    flex: 1,
    paddingHorizontal: 40,
    paddingTop: 20,
  },
  reportIncidentTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 40,
  },
  reportIncidentTextArea: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#f9f9f9',
    minHeight: 120,
    marginBottom: 20,
  },
  reportIncidentPlaceholder: {
    color: '#999999',
    fontSize: 16,
    lineHeight: 22,
  },
  addPhotoButton: {
    backgroundColor: '#20B2AA',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
    marginBottom: 30,
  },
  addPhotoButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  submitIncidentButton: {
    backgroundColor: '#FF8C00',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitIncidentButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },

  // Pre-Trip Inspection Screen Styles
  preTripContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  preTripHeader: {
    paddingTop: 20,
    paddingLeft: 20,
    paddingBottom: 10,
  },
  preTripContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  preTripTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 30,
    textAlign: 'center',
  },
  inspectionDetailsSection: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  inspectionDetailField: {
    marginBottom: 20,
  },
  inspectionDetailLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 8,
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#f9f9f9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownButtonText: {
    color: '#333333',
    fontSize: 16,
  },
  dropdownArrow: {
    color: '#666666',
    fontSize: 12,
  },
  dropdownOptions: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownOptionText: {
    color: '#333333',
    fontSize: 16,
  },
  inspectionDetailInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#f9f9f9',
  },
  inspectionDetailPlaceholder: {
    color: '#999999',
    fontSize: 16,
  },
  busNumberInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    fontSize: 16,
    color: '#333333',
  },
  preTripItem: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    backgroundColor: '#ffffff',
  },
  preTripItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#20B2AA',
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  checkboxChecked: {
    backgroundColor: '#20B2AA',
    borderColor: '#20B2AA',
  },
  checkboxTick: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  preTripItemLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  preTripNotesArea: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
    marginBottom: 12,
    minHeight: 50,
  },
  preTripNotesPlaceholder: {
    color: '#999999',
    fontSize: 14,
  },
  preTripNotesInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#ffffff',
    marginBottom: 12,
    minHeight: 60,
    fontSize: 14,
    textAlignVertical: 'top',
  },
  preTripScrollView: {
    flex: 1,
  },
  preTripScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  preTripTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 30,
    paddingLeft: 20,
  },
  preTripDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  submitInspectionButton: {
    backgroundColor: '#20B2AA',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 40,
    marginTop: 20,
    marginBottom: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitInspectionButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },

  // Create Account Screen Styles (only the orange button)
  createAccountSubmitButton: {
    backgroundColor: '#FF8C00',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 40,
    marginTop: 20,
    marginBottom: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  // Welcome Screen Styles
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  busIcon: {
    width: 80,
    height: 80,
    backgroundColor: '#ff8c00',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  busIconText: {
    fontSize: 36,
    color: 'white',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 50,
    fontWeight: '400',
  },
  loginOption: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    alignItems: 'center',
    width: '100%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  adminIcon: {
    width: 50,
    height: 50,
    backgroundColor: '#4285f4',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  driverIcon: {
    width: 50,
    height: 50,
    backgroundColor: '#34a853',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconText: {
    fontSize: 20,
    color: 'white',
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
  },
  createAccountContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  createAccountText: {
    color: '#666',
    marginBottom: 10,
  },
  createAccountButton: {
    borderWidth: 2,
    borderColor: '#ff8c00',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  createAccountButtonText: {
    color: '#ff8c00',
    fontWeight: 'bold',
  },
  
  // Login Screen Styles
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
  },
  loginIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  adminLoginIcon: {
    backgroundColor: '#ff8c00',
  },
  driverLoginIcon: {
    backgroundColor: '#34a853',
  },
  loginIconText: {
    fontSize: 40,
    color: 'white',
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    color: '#ff8c00',
    fontSize: 16,
  },
  proceedButton: {
    backgroundColor: '#4285f4',
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginTop: 20,
  },
  driverProceedButton: {
    backgroundColor: '#34a853',
  },
  proceedButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  
  // Inspection Screen Styles
  stepHeader: {
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  stepRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepContainer: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  activeStep: {
    backgroundColor: '#ff8c00',
  },
  stepText: {
    color: '#666',
    fontSize: 14,
    fontWeight: 'bold',
  },
  activeStepText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  inspectionForm: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  inspectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  reportRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  reportLabel: {
    fontSize: 16,
    color: '#666',
    marginRight: 8,
  },
  reportNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff8c00',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  requiredLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  inputBox: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f9f9f9',
  },
  inputPlaceholder: {
    color: '#999',
  },
  busHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  changeButton: {
    color: '#ff8c00',
    fontSize: 14,
  },
  busCard: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  busTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  busDetails: {
    marginLeft: 8,
  },
  busDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  availableStatus: {
    fontSize: 14,
    color: '#34a853',
    fontWeight: '500',
  },
  meterRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  meterInputBox: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f9f9f9',
    width: 100,
    marginRight: 12,
  },
  meterValue: {
    fontSize: 16,
    color: '#333',
  },
  milesLabel: {
    fontSize: 16,
    color: '#666',
  },
  currentMeter: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  gpsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationButton: {
    backgroundColor: '#ff8c00',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  locationButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  nextButton: {
    backgroundColor: '#ff8c00',
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  headerContainer: {
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 30,
  },
  buscorText: {
    fontSize: 28,
    fontWeight: '300',
    color: '#FF8C00',
    letterSpacing: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  busIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF8C00',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  busIconText: {
    fontSize: 40,
    color: 'white',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 30,
  },
  adminButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  driverButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adminIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  driverIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  iconText: {
    fontSize: 24,
    color: 'white',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adminIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  driverIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  iconText: {
    fontSize: 24,
    color: 'white',
  },
  buttonTextContainer: {
    flex: 1,
  },
  buttonTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  buttonSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  createAccountSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  createAccountText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  createAccountButton: {
    borderWidth: 2,
    borderColor: '#FF8C00',
    borderRadius: 8,
    paddingHorizontal: 30,
    paddingVertical: 12,
  },
  createAccountButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF8C00',
  },
  version: {
    fontSize: 14,
    color: '#999',
    position: 'absolute',
    bottom: 20,
  },
  loginContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
  },
  backButton: {
    marginTop: 20,
    padding: 15,
  },
  backButtonText: {
    fontSize: 16,
    color: '#FF8C00',
    fontWeight: '600',
  },
  proceedButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    paddingHorizontal: 30,
    paddingVertical: 15,
    marginTop: 20,
  },
  proceedButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  inspectionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  inspectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  inspectionText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  photosContainer: {
    marginTop: 15,
    marginBottom: 15,
  },
  photosTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  capturedPhoto: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#20B2AA',
  },
});
