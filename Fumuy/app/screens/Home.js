import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import filter from 'lodash.filter';
import {FlatList} from 'react-native-gesture-handler';
import {Avatar} from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/MaterialCommunityIcons';
import {Searchbar} from 'react-native-paper';
import FacePile from 'react-native-face-pile';
import { CommonActions, useNavigation } from '@react-navigation/native' 
const {width, height} = Dimensions.get('window');
import {AuthContext} from '../components/context';

export default function Home() {
  const navigation = useNavigation();
  const {currentUser} =React.useContext(AuthContext);
  const [selected, setSelected] = useState('');
  const [query, setQuery] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([
    {
      id: 1,
      name: 'Channel 1',
      userCount: 3,
      users: [
        {
          id: 1,
          name: 'Yunus Emre',
          imageUrl:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdGr3Y4jJcPGXMP6yvI70Fp1xrrN1AHLZPiw&usqp=CAx',
        },
        {
          id: 2,
          name: 'Mücahit Veli',
          imageUrl:
            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',
        },
        {
          id: 3,
          name: 'Mücahit Veli',
          imageUrl:
            'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80',
        },
      ],
    },
    {
      id: 2,
      name: 'Channel 2',
      userCount: 4,
      users: [
        {
          id: 1,
          name: 'Yunus Emre',
          imageUrl:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80',
        },
        {
          id: 2,
          name: 'Mücahit Veli',
          imageUrl:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80',
        },
        {
          id: 3,
          name: 'Yunus Emre@',
          imageUrl:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80',
        },
        {
          id: 4,
          name: 'Mücahit Veli',
          imageUrl:
            'https://images.unsplash.com/photo-1601455763557-db1bea8a9a5a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1986&q=81',
        },
      ],
    },
    {
      id: 3,
      name: 'Channel 3',
      userCount: 1,
      users: [
        {
          id: 1,
          name: 'Yunus Emre',
          imageUrl:
            'https://images.unsplash.com/photo-1455274111113-575d080ce8cd?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80',
        },
      ],
    },
    {
      id: 4,
      name: 'Channel 4',
      userCount: 1,
      users: [
        {
          id: 1,
          name: 'Yunus Emre',
          imageUrl:
            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',
        },
      ],
    },
  ]);
  const [fullData, setFullData] = useState([
    {
      id: 1,
      name: 'Channel 1',
      userCount: 3,
      users: [
        {
          id: 1,
          name: 'Yunus Emre',
          imageUrl:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdGr3Y4jJcPGXMP6yvI70Fp1xrrN1AHLZPiw&usqp=CAx',
        },
        {
          id: 2,
          name: 'Mücahit Veli',
          imageUrl:
            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',
        },
        {
          id: 3,
          name: 'Mücahit Veli',
          imageUrl:
            'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80',
        },
      ],
    },
    {
      id: 2,
      name: 'Channel 2',
      userCount: 4,
      users: [
        {
          id: 1,
          name: 'Yunus Emre',
          imageUrl:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80',
        },
        {
          id: 2,
          name: 'Mücahit Veli',
          imageUrl:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80',
        },
        {
          id: 3,
          name: 'Yunus Emre@',
          imageUrl:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80',
        },
        {
          id: 4,
          name: 'Mücahit Veli',
          imageUrl:
            'https://images.unsplash.com/photo-1601455763557-db1bea8a9a5a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1986&q=81',
        },
      ],
    },
    {
      id: 3,
      name: 'Channel 3',
      userCount: 1,
      users: [
        {
          id: 1,
          name: 'Yunus Emre',
          imageUrl:
            'https://images.unsplash.com/photo-1455274111113-575d080ce8cd?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80',
        },
      ],
    },
    {
      id: 4,
      name: 'Channel 4',
      userCount: 1,
      users: [
        {
          id: 1,
          name: 'Yunus Emre',
          imageUrl:
            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',
        },
      ],
    },
  ]);

  const renderItem = ({item}) => {
    return <Item users={item.users} name={item.name} id={item.id} />;
  };
  const Item = ({users, name, id}) => {
    return (
      <View style={styles.item}>
        <FacePile numFaces={2} faces={users} />
        <Text style={styles.itemTitle}>{name}</Text>
        <TouchableOpacity
          onPress={() => {
            setSelected(id);
            navigation.navigate('Explore',{ userName:currentUser.username,roomName:name});
          }}>
          <FontAwesome name="video-plus-outline" size={30} color="#080080" />
        </TouchableOpacity>
      </View>
    );
  };
  
  const searchFilterFunction = text => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource
      // Update FilteredDataSource
      const newData = fullData.filter(function (item) {
        const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredDataSource(newData);
      setQuery(text);
    } else {
      setFilteredDataSource(fullData);
      setQuery(text);
    }
  };

  return (
    <View style={styles.container}>
      <Searchbar
        style={styles.searchBar}
        onChangeText={searchFilterFunction}
        value={query}
        inputStyle={styles.input}
      />
      <FlatList
        data={filteredDataSource}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  item: {
    backgroundColor: '#F0F2E9',
    marginHorizontal: 10,
    width: '95%',
    paddingVertical: 6,
    paddingRight: 20,
    borderBottomRightRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 8,
    borderBottomWidth: 0.2,
    borderRightWidth: 0.5,
    borderColor: '#004DFF',
  },
  title: {
    fontSize: 20,
  },
  searchBar: {
    width: '95%',
    marginHorizontal: width * 0.025,
    borderRadius: 50,
    marginBottom: 20,
  },
  itemTitle: {
    position: 'absolute',
    start: width * 0.4,
    fontWeight: '600',
    color: '#27376C',
    fontSize: 17,
  },
  input: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
  },
});
