import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
/* eslint-disable react-native/no-color-literals */
import React from 'react';
import {
  Alert,
  BackHandler,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import checkmarkIcon from '../../assets/svgs/checkmarkIcon';
import xmarkIcon from '../../assets/svgs/xmarkIcon';
import NavigationBarWrapper from '../../components/NavigationBarWrapper';
import Colors from '../../constants/colors';
import { USER_UUID } from '../../constants/storage';
import { GetStoreData } from '../../helpers/General';
import { SettingsItem as Item } from '../Settings/SettingsItem';

class Symptoms extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      temperature: 0,
      pressure: 0,
      oxygen: 0,
      breath: {
        checked: false,
        label: 'Fiato Corto (quando cammini, ti eserciti, in generale)',
      },
      cough: {
        checked: false,
        label: 'Tosse',
      },
      smell: {
        checked: false,
        label: 'Mancanza di olfatto',
      },
      nose: {
        checked: false,
        label: 'Naso che cola',
      },
      headache: {
        checked: false,
        label: 'Mal di testa',
      },
      muscle: {
        checked: false,
        label: 'Dolori muscolari',
      },
      throat: {
        checked: false,
        label: 'Mal di gola',
      },
      chest: {
        checked: false,
        label: 'Dolore al petto',
      },
      nausea: {
        checked: false,
        label: 'Nausea/Vomito',
      },
      confused: {
        checked: false,
        label: 'Ti senti- ti hanno detto che sembri confuso',
      },
      exhaustion: {
        checked: false,
        label: 'Senza energia',
      },
      diarrhoea: {
        checked: false,
        label: 'Diarrea',
      },
      sneezing: {
        checked: false,
        label: 'Sfoghi cutanei',
      },
      rash: {
        checked: false,
        label: 'Starnutisci',
      },
    };
  }

  componentDidMount = () => {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  };

  componentWillUnmount = () => {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  };

  handleBackPress = () => {
    this.props.navigation.goBack();
    return true;
  };

  handleChange = symptom => {
    this.setState({
      ...this.state,
      [symptom]: {
        checked: !this.state[symptom].checked,
        label: this.state[symptom].label,
      },
    });
  };

  sendSymptoms = async () => {
    const uuid = await GetStoreData(USER_UUID);
    const cldFn = await firebase
      .app()
      .functions('europe-west1')
      .httpsCallable('addPatientSymptoms');

    let symptoms = {};
    for (let key in this.state) {
      if (key !== 'temperature' && key !== 'pressure' && key !== 'oxygen') {
        symptoms[key] = this.state[key].checked;
      }
    }
    symptoms.temperature = this.state.temperature;
    symptoms.pressure = this.state.pressure;
    symptoms.oxygen = this.state.oxygen;
    cldFn({ uuid, symptoms });

    Alert.alert('Symptoms added');
  };

  render() {
    let symptoms = [];
    for (let key in this.state) {
      if (key !== 'temperature' && key !== 'pressure' && key !== 'oxygen') {
        symptoms.push(key);
      }
    }
    return (
      <NavigationBarWrapper
        title={'Sintomi'}
        onBackPress={() => this.props.navigation.goBack()}>
        <ScrollView style={{ paddingHorizontal: 20 }}>
          <TextInput
            style={{
              height: 40,
              borderRadius: 5,
              borderWidth: 1,
              borderColor: Colors.VIOLET,
              lineHeight: 19,
              fontSize: 15,
              color: '#000',
              letterSpacing: 0,
              paddingHorizontal: 10,
              marginTop: 10,
            }}
            placeholder={'Temperatura'}
            placeholderTextColor='#555555'
            keyboardType={'number-pad'}
            value={this.state.temperature}
            onChangeText={v => this.setState({ temperature: v })}
          />

          <TextInput
            style={{
              height: 40,
              borderRadius: 5,
              borderWidth: 1,
              borderColor: Colors.VIOLET,
              lineHeight: 19,
              fontSize: 15,
              color: '#000',
              letterSpacing: 0,
              paddingHorizontal: 10,
              marginTop: 10,
            }}
            placeholder={'Ossigeno'}
            placeholderTextColor='#555555'
            keyboardType={'number-pad'}
            value={this.state.oxygen}
            onChangeText={v => this.setState({ oxygen: v })}
          />

          <TextInput
            style={{
              height: 40,
              borderRadius: 5,
              borderWidth: 1,
              borderColor: Colors.VIOLET,
              lineHeight: 19,
              fontSize: 15,
              color: '#000',
              letterSpacing: 0,
              paddingHorizontal: 10,
              marginTop: 10,
            }}
            placeholder={'Pressione'}
            placeholderTextColor='#555555'
            keyboardType={'number-pad'}
            value={this.state.pressure}
            onChangeText={v => this.setState({ pressure: v })}
          />

          {symptoms.map((symptom, ind) => (
            <Item
              key={ind}
              label={this.state[symptom].label}
              icon={this.state[symptom].checked ? checkmarkIcon : xmarkIcon}
              onPress={() => this.handleChange(symptom)}
            />
          ))}

          <TouchableOpacity
            style={{
              height: 50,
              marginBottom: 20,
              paddingVertical: 10,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 5,
              backgroundColor: Colors.VIOLET,
            }}
            onPress={this.sendSymptoms}>
            <Text
              style={{
                fontSize: 18,
                color: 'white',
              }}>
              {'Invia'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </NavigationBarWrapper>
    );
  }
}

export default Symptoms;
