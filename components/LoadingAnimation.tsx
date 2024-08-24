import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AnimatedLoader from 'react-native-animated-loader';

interface LoaderState {
  visible: boolean;
}

export default class Loader extends Component<{}, LoaderState> {
  private intervalId: NodeJS.Timeout | null = null;

  constructor(props: {}) {
    super(props);
    this.state = { visible: false };
  }

  componentDidMount() {
    this.intervalId = setInterval(() => {
      this.setState(prevState => ({
        visible: !prevState.visible
      }));
    }, 2000);
  }

  componentWillUnmount() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  render() {
    const { visible } = this.state;
    return (
      <View style={styles.container}>
        <AnimatedLoader
          visible={visible}
          overlayColor="rgba(255,255,255,0.75)"
          source={require('../assets/loader.json')}
          animationStyle={styles.lottie}
          speed={1}
        >
          <Text>Doing something...</Text>
        </AnimatedLoader>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: 100,
    height: 100,
  },
});
