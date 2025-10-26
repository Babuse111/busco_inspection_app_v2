import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function BuscorLogo({ size = 120 }) {
  return (
    <View style={styles.container}>
      {/* Logo Symbol */}
      <View style={styles.logoSymbol}>
        {/* Orange "b" letter */}
        <View style={styles.letterB}>
          <Text style={styles.bText}>b</Text>
        </View>
        {/* Circular design */}
        <View style={styles.circleContainer}>
          <View style={styles.outerCircle}>
            <View style={styles.innerCircle}>
              <View style={styles.centerDot} />
            </View>
          </View>
        </View>
      </View>
      
      {/* Company Name */}
      <View style={styles.textContainer}>
        <Text style={styles.busText}>bus</Text>
        <Text style={styles.corText}>cor</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoSymbol: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  letterB: {
    width: 60,
    height: 80,
    backgroundColor: '#FF8C42',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    marginRight: -10,
    zIndex: 2,
  },
  bText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
  },
  circleContainer: {
    position: 'relative',
  },
  outerCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF8C42',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#00B4A6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFD700',
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  busText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#00B4A6',
  },
  corText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FF8C42',
  },
});
