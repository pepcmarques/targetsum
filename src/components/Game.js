import React from "react";
import PropTypes from "prop-types";

import shuffle from "lodash.shuffle";

import { View, Text, Button, StyleSheet } from "react-native";

import RandomNumber from "./RandomNumber";

class Game extends React.Component {
  static propTypes = {
    randomNumberCount: PropTypes.number.isRequired,
    initialSeconds: PropTypes.number.isRequired,
    onPlayAgain: PropTypes.func.isRequired,
  };

  state = {
    selectedIds: [],
    remainingSeconds: this.props.initialSeconds,
  };

  gameStatus = "PLAYING";

  randomNumbers = Array.from({ length: this.props.randomNumberCount }).map(
    () => 1 + Math.floor(10 * Math.random())
  );

  shuffledRandomNumbers = shuffle(this.randomNumbers);

  target = this.randomNumbers
    .slice(0, this.props.randomNumberCount - 2)
    .reduce((acc, curr) => acc + curr, 0);

  isNumberSelected = (numberIndex) => {
    return this.state.selectedIds.indexOf(numberIndex) >= 0;
  };

  selectNumber = (numberIndex) => {
    this.setState((state, props) => {
      return {
        selectedIds: [...state.selectedIds, numberIndex],
      };
    });
  };

  componentDidMount() {
    this.intervalId = setInterval(() => {
      this.setState(
        (prevState) => {
          return { remainingSeconds: prevState.remainingSeconds - 1 };
        },
        // The second argument of the callback will be run after the setState operation
        // setState is asynchronous
        () => {
          if (this.state.remainingSeconds === 0) {
            clearInterval(this.intervalId);
          }
        }
      );
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  // This lifecycle happens when the component is about to update
  // when the state of the component has changed or
  // when the props of the component has changed
  UNSAFE_componentWillUpdate(nextProps, nextState) {
    if (
      nextState.selectedIds !== this.state.selectedIds ||
      nextState.remainingSeconds === 0
    ) {
      this.gameStatus = this.calcGameStatus(nextState);
      if (this.gameStatus !== "PLAYING") {
        clearInterval(this.intervalId);
      }
    }
  }

  calcGameStatus = (nextState) => {
    const sumSelected = nextState.selectedIds.reduce((acc, curr) => {
      return acc + this.shuffledRandomNumbers[curr];
    }, 0);
    if (nextState.remainingSeconds === 0) {
      return "LOST";
    }
    if (sumSelected < this.target) {
      return "PLAYING";
    }
    if (sumSelected === this.target) {
      return "WON";
    }
    if (sumSelected > this.target) {
      return "LOST";
    }
  };

  render() {
    const gameStatus = this.gameStatus;
    return (
      <View style={styles.container}>
        <Text style={[styles.target, styles[`STATUS_${gameStatus}`]]}>
          {this.target}
        </Text>
        <View style={styles.randomContainer}>
          {this.shuffledRandomNumbers.map((randomNumber, index) => (
            // note: onPress could be named as any other name.
            // for example selectNumber={this.selectNumber}
            <RandomNumber
              key={index}
              id={index}
              number={randomNumber}
              isDisabled={
                this.isNumberSelected(index) || gameStatus !== "PLAYING"
              }
              onPress={this.selectNumber}
            />
          ))}
        </View>
        {this.gameStatus !== "PLAYING" && (
          <Button title="Play again" onPress={this.props.onPlayAgain} />
        )}
        <Text>{this.state.remainingSeconds}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: "#ddd",
  },

  target: {
    fontSize: 40,
    marginHorizontal: 50,
    textAlign: "center",
  },

  STATUS_PLAYING: {
    backgroundColor: "#aaa",
  },

  STATUS_WON: {
    backgroundColor: "green",
  },

  STATUS_LOST: {
    backgroundColor: "red",
  },

  randomContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
});

export default Game;
