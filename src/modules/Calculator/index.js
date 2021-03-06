import React, { useEffect, useState } from 'react';
import styled, { withTheme } from 'styled-components/native';
import { Dimensions, ScrollView, TextInput,Modal, Button, View, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Ingredient from '../../component/ingredient';
import { connect } from 'react-redux';
import { store } from '../../../Redux/Store.js';
import { personalStore } from '../../../Redux/Store.js';
import AppLoading from 'expo-app-loading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { applyMiddleware } from 'redux';
import { useNavigation } from "@react-navigation/native";
import * as Font from 'expo-font';

const WIDTH = Dimensions.get('screen').width;
const HEIGHT = Dimensions.get('screen').height;

const Wrapper = styled.View``;
const Text = styled.Text`
  font-size: 15px;
`;

const InputContainer = styled.View`
  /* width: ${WIDTH*0.45}; */
`;

const AddBtn = styled.View`
  width: ${WIDTH*0.3}px;
  height: ${WIDTH*0.5*0.3}px;
  /* background-color: #dcdc; */
  background-color: lightgray;
  border-radius: 10px;
`;
const AddText = styled.Text`
  margin: auto;
  font-family: 'Delius';
  font-size: 12px;
`;
const NameContainer = styled.View`
  align-items: center;
  justify-content: space-around;
  flex-direction: row;
  flex-wrap: wrap;
  /* background-color:lightyellow; */
  margin-top: ${WIDTH*0.03}px;
  margin-bottom: ${WIDTH*0.03}px;
`;
const SaveBtn = styled.View`
  width: ${WIDTH*0.25}px;
  height: ${WIDTH*0.25*0.4}px;
  background-color: lightgray;
  border-radius: 5px;
`;
const SaveText = styled.Text`
  margin: auto;
  font-family: 'Delius';
  font-size: 12px;
`;
const DevListBtn = styled.View`
  width: ${WIDTH*0.5}px;
  height: ${WIDTH*0.5*0.2}px;
  background-color: purple;
  margin: 5px auto auto;
`;
const ResetBtn = styled.View`
  width: ${WIDTH*0.3}px;
  height: ${WIDTH*0.5*0.3}px;
  background-color: lightgray;
  border-radius: 10px;
`;
const ResetText = styled.Text`
  margin: auto;
  font-family: 'Delius';
  font-size: 12px;
`;
const ModalWrapper = styled.View`
  height: ${HEIGHT*0.4}px;
  background-color: #fff;
  margin-top: ${HEIGHT*0.15}px;
`;
const IngredientContainer = styled.View`
  height: ${HEIGHT*0.46}px;
  border: 0.5px lightgray solid;
`;
const FlourContainer = styled.View`
  align-items: center;
  justify-content: space-around;
  flex-direction: row;
  flex-wrap: wrap;
  /* background-color:lightyellow; */
  margin-top: ${WIDTH*0.05}px;
`;
const Apply = styled.View`
  width: ${WIDTH*0.25}px;
  height: ${WIDTH*0.25*0.6}px;
  background-color: #F4C8AC;
  border-radius: 5px;
`;
const ApplyText = styled.Text`
  margin: auto;
  font-family: 'Delius';
  font-size: 12px;
`;
const ButtomContainer = styled.View`
  /* background-color: lightyellow; */
  align-items: center;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  margin-top: ${HEIGHT*0.01}px;
`;
const TopContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  width: ${WIDTH}px;
  
`;

const AddIgdBtn = styled.View`
  width: ${WIDTH*0.8}px;
  height: ${WIDTH*0.8*0.2}px;
  background-color: #F4C8AC;
`;
const AddIgdText = styled.Text``;
const Blank = styled.View`
  height: 10px;
  font-family: 'Delius';
`;
const ModalInputContainer = styled.View`
  width: ${WIDTH}px;
  height: ${HEIGHT*0.2}px;
  justify-content: center;
  align-items: center;
`;
const InputFromBR = styled.Text`
  width: ${WIDTH*0.5}px;
  text-align: center;
  /* background-color: lightyellow; */
  font-size: 16px;
  font-family: 'Delius';
`;

const igdList = [];

const Calculator = (cur) => {
  // console.log("cur in calculator: ", cur);
  const [inputFromBR, setInputFromBR] = useState('')
  const [inputFlour, setInputFlour] = useState('');
  const [targetFlour, setTargetFlour] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [inputName, setInputName] = useState('');
  const [inputGram, setInputGram] = useState(0.0);
  const [title, setTitle] = useState('');

  const valid = () => {
    return title && inputFlour && (store.getState().tray.length!=0);
  }
  const add = () => {
    if(inputFlour || inputFromBR )  setModalVisible(true);
    else alert('please insert flour first!')
  }
  const save = async() => {
    if(!title){
      alert('submit name first');
      return;
    }
    if(!valid()){
      alert('list up ingredient first');
      return;
    }

    let list = store.getState();
    
    if(inputFromBR) setInputFlour(inputFromBR);
    list.tray.push({"inputFlour": inputFlour});

    await AsyncStorage.setItem(title,JSON.stringify(list))
    .then(()=>console.log('successfully saved'))
    .catch(()=>'error in saving')
    alert('saved!')
  }
  const devList = () => {console.log(store.getState());}
  const devstorageList = async() => {
    const keys = await AsyncStorage.getAllKeys();
      const localList = await AsyncStorage.multiGet(keys);
      // console.log(localList);  
  } 
  const apply = () => {
    console.log("apply")
    store.dispatch({
      type:'apply',
      value: targetFlour
    })
  }
  const reset = () => {
    store.dispatch({type:'reset'})
    setInputFlour('');
    setTargetFlour('');
    setTitle('');
    setInputFromBR();
  }
  const loadAssets = () => {}
  const onFinish = () => {}

  const navigation = useNavigation();
  useEffect(() => {
    navigation.addListener('blur', ()=>store.dispatch({type:'reset'}))
    setInputFlour('');
    setTargetFlour('');
  }, []);

  const [loaded] = Font.useFonts({
    'Delius': require('../../../assets/fonts/Delius-Regular.ttf'),
  });

  useEffect(() => {
    if(cur.route.params!==undefined)  {
      setInputFromBR(parseInt(cur.route.params.inputFlour));
      setInputFlour(parseInt(cur.route.params.inputFlour));
    }
  }, [])

  if(loaded){
  return (
    <Wrapper>
      {/* <TouchableOpacity onPress={devList}><DevListBtn /></TouchableOpacity>
      <TouchableOpacity onPress={devstorageList}><DevListBtn /></TouchableOpacity> */}
      <FlourContainer>
        <InputContainer>
        {
          inputFromBR?
          <InputFromBR>{inputFromBR}</InputFromBR>
          :
          <TextInput 
          placeholder = 'Insert Flour (g)'
          label="input Flour"
          // defaultValue={inputFromBR}
          value={inputFlour}
          onChangeText={cur=>setInputFlour(cur)}
          style={{
            width: WIDTH*0.5, 
            borderBottomColor: 'lightgray',
            borderBottomWidth: 1,
            fontSize: 16,
            textAlign: 'center',
            fontFamily: 'Delius',
            fontSize: 12
          }}
          keyboardType={'numeric'}
        />
        }
        
        <TextInput 
          placeholder = "Target Flour (g)"
          label="input Flour"
          value={targetFlour}
          onChangeText={cur=>setTargetFlour(cur)}
          style={{
            width: WIDTH*0.5, 
            borderBottomColor: 'lightgray',
            borderBottomWidth: 1,
            fontSize: 16,
            textAlign: 'center',
            marginTop: 10,
            fontFamily: 'Delius',
            fontSize: 12
          }}
          keyboardType={'numeric'}
        />
        </InputContainer>
        <TouchableOpacity onPress={apply}>
          <Apply>
          <ApplyText>APPLY</ApplyText>
          </Apply>
        </TouchableOpacity>
      </FlourContainer>
      
      <NameContainer>
        <TextInput 
          placeholder="Name of recipe"
          value={title}
          onChangeText={cur=>setTitle(cur)}
          style={{
            width: WIDTH*0.5, 
            borderBottomColor: 'lightgray',
            borderBottomWidth: 1,
            fontSize: 12,
            textAlign: 'center',
            fontFamily: 'Delius'
          }}
        />
        <TouchableOpacity onPress={save}><SaveBtn>
        <SaveText>SAVE</SaveText>
        </SaveBtn></TouchableOpacity>
      </NameContainer>

      <IngredientContainer>
      <ScrollView>
        {
          store.getState().tray.map(cur=>
            <Ingredient key={cur.inputName} cur={cur}/>
          )
        }
      </ScrollView>
      </IngredientContainer>
      <ButtomContainer>

        {/* <TopContainer> */}
        <TouchableOpacity onPress={reset}><ResetBtn>
        <ResetText>RESET</ResetText>
        </ResetBtn></TouchableOpacity>

        <TouchableOpacity onPress={add}><AddBtn>
        <AddText>ADD</AddText>
        </AddBtn></TouchableOpacity>
        {/* </TopContainer> */}

      </ButtomContainer>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
      >
        <ModalWrapper>
        <ModalInputContainer>
        <TextInput 
          placeholder="Ingredient"
          value={inputName}
          onChangeText={cur=>setInputName(cur)}
          style={{
            width: WIDTH*0.5,
            backgroundColor: "#fff",
            borderBottomColor: 'lightgray',
            borderBottomWidth: 1,
            marginTop: 5,
            marginBottom: 5,
            textAlign: 'center',
            height: HEIGHT*0.07,
            fontFamily: 'Delius'
          }}
        />
        <TextInput 
          placeholder="(g)"
          value={inputGram}
          onChangeText={cur=>setInputGram(cur)}
          style={{
            width: WIDTH*0.5,
            backgroundColor: "#fff",
            borderBottomColor: 'lightgray',
            borderBottomWidth: 1,
            marginTop: 5,
            marginBottom: 5,
            textAlign: 'center',
            height: HEIGHT*0.07,
            fontFamily: 'Delius'
          }}
          keyboardType={'numeric'}
        />
        </ModalInputContainer>

        <Button 
          title="Add Ingredient"
          onPress={()=>{
            store.dispatch({
              type:'addIgd',
              value:{
                "inputName":inputName, 
                "inputGram":inputGram,
                "percentage":(((inputGram/inputFlour))*100).toFixed(1),
                "targetGram":(((inputGram/inputFlour))*targetFlour).toFixed(1)
              }
            })
            // setModalVisible(!modalVisible);
            setInputName('');
            setInputGram('');
            alert('ingredient added!');
          }}
        />
        <Blank />
        <Button 
          title="Go Back"
          onPress={()=> setModalVisible(!modalVisible)}
        />

        </ModalWrapper>
      </Modal>
    </Wrapper>
  )
  } else {
    return(
      <AppLoading 
        startAsync={loadAssets}
        onFinish={onFinish}
        onError={console.warn}
      />
    )
  }
}

const mapStateToProps = ( state ) => {
  return ({ state : state });
};
const mapDispatchToProps = ( dispatch ) => {
  return ({ dispatch: dispatch });
};

export default connect(mapStateToProps, mapDispatchToProps)(Calculator);