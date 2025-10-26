import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome');

  const renderWelcomeScreen = () => (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.buscorText}>buscor</Text>
      </View>

      {/* Main content */}
      <View style={styles.content}>
        {/* Bus icon */}
        <View style={styles.busIcon}>
          <Text style={styles.busIconText}>🚌</Text>
        </View>

        {/* App title */}
        <Text style={styles.title}>BUS CMMS</Text>
        <Text style={styles.subtitle}>Bus Inspection & Maintenance App</Text>

        {/* Login buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.adminButton}
            onPress={() => setCurrentScreen('adminLogin')}
          >
            <View style={styles.buttonContent}>
              <View style={styles.adminIcon}>
                <Text style={styles.iconText}>👤</Text>
              </View>
              <View style={styles.buttonTextContainer}>
                <Text style={styles.buttonTitle}>Admin Login</Text>
                <Text style={styles.buttonSubtitle}>Manage operations</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.driverButton}
            onPress={() => setCurrentScreen('driverLogin')}
          >
            <View style={styles.buttonContent}>
              <View style={styles.driverIcon}>
                <Text style={styles.iconText}>🔧</Text>
              </View>
              <View style={styles.buttonTextContainer}>
                <Text style={styles.buttonTitle}>Driver/Mechanic/Team Login</Text>
                <Text style={styles.buttonSubtitle}>Perform inspections, maintenance</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Create account section */}
        <View style={styles.createAccountSection}>
          <Text style={styles.createAccountText}>Don't have an account?</Text>
          <TouchableOpacity style={styles.createAccountButton}>
            <Text style={styles.createAccountButtonText}>Create New Account</Text>
          </TouchableOpacity>
        </View>

        {/* Version */}
        <Text style={styles.version}>v4.0.2</Text>
      </View>
    </SafeAreaView>
  );

  const renderAdminLogin = () => (
    <SafeAreaView style={styles.container}>
      <View style={styles.loginContainer}>
        <View style={styles.busIcon}>
          <Text style={styles.busIconText}>🚌</Text>
        </View>
        <Text style={styles.loginTitle}>Admin Login</Text>
        
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => setCurrentScreen('welcome')}
        >
          <Text style={styles.backButtonText}>← Back to Welcome</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.proceedButton}
          onPress={() => setCurrentScreen('inspection')}
        >
          <Text style={styles.proceedButtonText}>Proceed to Inspection</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  const renderDriverLogin = () => (
    <SafeAreaView style={styles.container}>
      <View style={styles.loginContainer}>
        <View style={[styles.busIcon, { backgroundColor: '#4CAF50' }]}>
          <Text style={styles.busIconText}>🚌</Text>
        </View>
        <Text style={styles.loginTitle}>Driver/Mechanic Login</Text>
        
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => setCurrentScreen('welcome')}
        >
          <Text style={styles.backButtonText}>← Back to Welcome</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.proceedButton, { backgroundColor: '#4CAF50' }]}
          onPress={() => setCurrentScreen('inspection')}
        >
          <Text style={styles.proceedButtonText}>Proceed to Inspection</Text>
        </TouchableOpacity>
      </View>
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

  // Render current screen
  switch (currentScreen) {
    case 'adminLogin':
      return renderAdminLogin();
    case 'driverLogin':
      return renderDriverLogin();
    case 'inspection':
      return renderInspectionScreen();
    default:
      return renderWelcomeScreen();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  // Welcome Screen Styles
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ff8c00',
    marginBottom: 10,
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
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
});
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },
  buscorText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF8C00',
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
});
