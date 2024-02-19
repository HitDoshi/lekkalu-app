import { Button, FlatList, HStack, IconButton, Text, VStack } from 'native-base'
import { useEffect, useState } from 'react'
import { EvilIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { View, useTheme } from 'tamagui'
import { FontSizes } from '@/utils/fonts'
import { hp, wp } from '@/utils/responsive'
import { THEME_COLORS } from '@/utils/theme'
import { StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import BackButton from '@/components/back-button'
import { deleteItem, getItemList } from '@/queries/local-state'
import LoaderOverlay from '@/components/loader-overlay'
import EmptyContent from '@/components/empty-content'
import CreateOrEditBudget from '@/components/add-or-edit-budget/add-or-edit-budget'
import dayjs from 'dayjs'

interface Budget {
  id: any
  limit: number
  month: Date
}

export default function BudgetList() {
  const theme = useTheme()
  const [budgetList, setBudgetList] = useState<Budget[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editData, setEditDate] = useState<Budget>()

  const { top } = useSafeAreaInsets()

  const getBudgetList = () => {
    try {
      setLoading(true)
      const data = getItemList('budget')
      setBudgetList(data)      
    } catch (error) {
      console.log(error)
    }finally{
      setLoading(false)
    }
  }

  const handleDeleteBudget = (budgetItem: Budget) => {
    setLoading(true)
    try {
      deleteItem('budget',budgetItem.id)
      getBudgetList();      
    } catch (error) {
      console.log(error);      
    }finally{
      setLoading(false)  
    }    
  }

  console.log(budgetList)

  useEffect(() => {
    if (!showModal) {
      getBudgetList()
    }
  }, [showModal])

  return (
    <>
      {loading && <LoaderOverlay />}
      <View f={1} pt={top + hp(2)}  marginHorizontal={wp(5)}>
        <View flexDirection="row" gap={wp(4)} alignItems="center" marginBottom={hp(2)}>
          <BackButton onPress={() => router.replace('/expenses')} />
          <Text fontSize={FontSizes.size26} fontWeight={'500'}>
            Your list of budgets
          </Text>
        </View>
        <FlatList
          keyExtractor={(item) => item.id.toString()}
          data={budgetList ?? []}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={!loading ? <EmptyContent title="No budget has been set yet!" /> : null}
          contentContainerStyle={budgetList.length === 0 ? { flexGrow: 1, justifyContent: 'center' } : null}
          renderItem={({ item }) => (
            <VStack
              space={4}
              bg={theme.background.get()}
              rounded="md"
              p="3"
              shadow="sm"
              mb="4"
              display={'flex'}
              flexDirection={'row'}
              justifyContent={'space-between'}
            >
              <View flex={1} mr={wp(3)}>
                <HStack space={2}>
                  <Text color={theme.foreground.get()} fontSize={FontSizes.size18}>
                    Month :{' '}
                  </Text>
                  <Text color={theme.foreground.get()} fontSize={FontSizes.size18} fontWeight="600">                    
                    {dayjs(item?.month).format('MMMM')}
                  </Text>
                </HStack>
                <HStack space={2} display={'flex'} flexWrap={'wrap'}>
                  <Text color={theme.foreground.get()} fontSize={FontSizes.size18}>
                    Limit :{' '}
                  </Text>
                  <Text color={theme.foreground.get()} fontSize={FontSizes.size18} fontWeight="600" flex={1}>
                    {item?.limit}
                  </Text>
                </HStack>
              </View>
              <Button.Group display={'flex'} alignItems={'center'}>
                <View>
                  <IconButton
                    size={6}
                    variant="solid"
                    _icon={{
                      as: EvilIcons,
                      name: 'pencil',
                      size: 5,
                    }}
                    onPress={() => {
                      setShowModal(true)
                      setEditDate(item)
                    }}
                  />
                </View>
                <View>
                  <IconButton
                    size={6}
                    variant="solid"
                    colorScheme="danger"
                    _icon={{
                      as: EvilIcons,
                      name: 'trash',
                      size: 5,
                    }}
                    onPress={() => {
                      handleDeleteBudget(item);
                    }}
                  />
                </View>
              </Button.Group>
            </VStack>
          )}
        />
      </View>
      <CreateOrEditBudget
        setShowModal={setShowModal}
        showModal={showModal}
        title="Edit Budget"
        isEdit={true}
        asset={editData}
      />
    </>
  )
}

const styles = StyleSheet.create({
  back: {
    height: wp(10),
    width: wp(10),
    backgroundColor: THEME_COLORS.primary[100] + 20,
    borderRadius: wp(6),
    justifyContent: 'center',
    alignItems: 'center',
  },
})
