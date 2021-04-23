import React, { useEffect, useState } from 'react'
import {
    View, 
    Text, 
    StyleSheet,
    FlatList
} from 'react-native'
import colors from '../styles/colors'
import api from '../services/api'



import {Header} from '../components/Header'
import fonts from '../styles/fonts'
import { EnvironmentButton } from '../components/EnvironmentButton'
import { PlantCardPrimary } from '../components/PlantCardPrimary'
import {Load} from '../components/Load'


interface EnvironmentProps{
    key: string;
    title: string;
}

interface PlantProps{
    id: string;
    name: string;
    about: string;
    water_tips: string;
    photo: string;
    environments: [string];
    frequency: {
        times: number;
        repeat_every: string;
    }
}

export function PlantSelect(){
    const[environments, setEnvironments] = useState<EnvironmentProps[]>([]);
    const[plants, setPlants] = useState<PlantProps[]>([]);
    const[filteredPlants, setFilteredPlants] = useState<PlantProps[]>([]);
    const[environmentSelected, setEnvironmentSelected] = useState('all');
    const [loading, setLoading] = useState(true)

    const [page,setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(true);
    const [loadedAll, setLoadedAll] = useState(false)

    function handleEnvironmentSelected (environment: string){
        setEnvironmentSelected(environment);

        if(environment=='all')
        return setFilteredPlants(plants)

        const filterd = plants.filter(plant =>
            plant.environments.includes(environment)
        );

        setFilteredPlants(filterd)
    }

    useEffect(()=>{
        async function fetchEnvironment(){
            const {data} = await api
            .get('plants_environments?_sort=title&_order=asc')
            setEnvironments([
                {
                    key: 'all',
                    title: 'Todos',
                },
                ...data
            ]);
        }

        fetchEnvironment();
    },[])

    useEffect(()=>{
        async function fetchPlants(){
            const {data} = await api
            .get(`plants?_sort=name&_order=asc&_page=${page}&_limit=8`)
            setPlants(data)
            setLoading(false)
        }

        fetchPlants();
    },[])

    if(loading)
    return <Load/>
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Header/>

                <Text style={styles.title}>
                    Em qual ambiente
                </Text>
                <Text style={styles.subtitle}>
                    Você quer colocar sua planta?
                </Text>
            </View>

            <View>
                <FlatList
                    data={environments}
                    renderItem ={({item})=>(
                        <EnvironmentButton
                            title={item.title}
                            active={item.key === environmentSelected}
                            onPress={()=>handleEnvironmentSelected(item.key)}
                        />
                    )}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.environmentList}
                />
            </View>

            <View style ={styles.plants}>
                <FlatList
                    data={filteredPlants}
                    renderItem ={({item})=>(
                        <PlantCardPrimary data={item}/>
                    )}
                    showsVerticalScrollIndicator={false}
                    numColumns={2}
                       
                />

            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: colors.background
    },
    title:{
        fontSize:17,
        color: colors.heading,
        fontFamily:fonts.heading,
        lineHeight: 20,
        marginTop: 15,
    },
    subtitle:{
        fontSize:17,
        color: colors.heading,
        fontFamily:fonts.text,
        lineHeight: 20,
        marginTop: 15, 
    }, 
    header:{
        paddingHorizontal: 30
    },
    environmentList:{
        height: 40,
        justifyContent:'center',
        paddingBottom: 5,
        marginLeft: 32,
        marginVertical: 32
    },
    plants:{
        flex:1,
        paddingHorizontal: 32,
        justifyContent:'center'
    }
})