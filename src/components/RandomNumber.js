import React, { Component } from "react";
import PropTypes from "prop-types";

import { Text, TouchableOpacity, StyleSheet } from "react-native";

// TouchableOpcity
// TouchableHighlight

class RandomNumber extends Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    number: PropTypes.number.isRequired,
    isDisabled: PropTypes.bool.isRequired,
    onPress: PropTypes.func.isRequired,
  };

  handlePress = () => {
    if (this.props.isDisabled) {
      return;
    }
    this.props.onPress(this.props.id);
  };

  render() {
    return (
      <TouchableOpacity onPress={this.handlePress}>
        <Text style={[styles.random, this.props.isDisabled && styles.disabled]}>
          {this.props.number}
        </Text>
      </TouchableOpacity>
    );
  }
}

export default RandomNumber;

const styles = StyleSheet.create({
  random: {
    fontSize: 40,
    backgroundColor: "#999",
    margin: 20,
    width: 100,
    textAlign: "center",
  },

  disabled: {
    opacity: 0.3,
  },
});
