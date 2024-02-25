import { AddIcon, Button, FlatList, HStack, Heading, VStack } from 'native-base'
import { useQuery } from '@tanstack/react-query'
import { Input, Text, View, useTheme } from 'tamagui'
import CreateOrEditAsset from '@/components/create-or-edit-asset/create-or-edit-asset'
import { BALANCE_SHEET } from '@/utils/query-keys'
import { fetchPhysicalAssets } from '@/queries/balance-sheet'
import { hp, wp } from '@/utils/responsive'
import { FontSizes } from '@/utils/fonts'
import { useState } from 'react'
import { Search } from '@tamagui/lucide-icons'
import { THEME_COLORS } from '@/utils/theme'
import { TouchableOpacity } from 'react-native'
import { StyleSheet } from 'react-native'
import { AntDesign } from '@expo/vector-icons'

export default function BalanceSheet() {
  const { data, isFetching } = useQuery({ queryKey: [BALANCE_SHEET.ASSETS], queryFn: fetchPhysicalAssets })
  const theme = useTheme()
  const [showModal, setShowModal] = useState(false)

  const assetsCategory = ['All', 'Cash', 'Account', 'Fund/Equity', 'Gold', 'Property', 'Physical']
  const [searchAssets, setSearchAssets] = useState(assetsCategory[0])

  return (
    <VStack flex={1} p={4} space={4} backgroundColor={theme.backgroundHover.get()}>
      <View gap={wp(2)} flexDirection="row">
        <View flexDirection="row" flex={1} alignItems="center">
          <Input
            fontSize={FontSizes.size16}
            h={hp(6)}
            br={wp(1.8)}
            placeholder="Search..."
            flex={1}
            onChangeText={(t) => setSearchAssets(t)}
          />
          <Search size={wp(6)} style={{ position: 'absolute', right: wp(3) }} color={THEME_COLORS.primary[500]} />
        </View>
      </View>

      <View>
        <FlatList
          data={assetsCategory}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                borderRadius: wp(16),
                paddingHorizontal: wp(5),
                paddingVertical: wp(1.5),
                borderWidth: 1,
                marginRight: wp(2),
                borderColor: 'silver',
                backgroundColor: searchAssets === item ? THEME_COLORS.brand[900] : 'transparent',
              }}
              onPress={() => {
                setSearchAssets(item)
              }}
            >
              <Text color={searchAssets === item ? 'white' : 'black'} fontSize={FontSizes.size16}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* <Heading fontSize={FontSizes.size26} color={theme.foreground.get()}>
        Your physical assets
      </Heading> */}

      <FlatList
        refreshing={isFetching}
        data={data}
        renderItem={({ item }) => (
          <VStack space={5} bg={theme.background.get()} rounded="md" p="4" shadow="sm" mb="4">
            <Heading color={theme.foreground.get()}>{item.name}</Heading>
            <HStack space={2} fontSize="xl">
              <Text color={'$foreground'} fontSize={FontSizes.size20}>
                Name :{' '}
              </Text>
              <Text color={'$foreground'} fontSize={FontSizes.size20} fontWeight="bold">
                {item.name}
              </Text>
            </HStack>
            <HStack space={2} fontSize="xl">
              <Text color={'$foreground'} fontSize={FontSizes.size20}>
                Current Value :{' '}
              </Text>
              <Text color={'$foreground'} fontSize={FontSizes.size20} fontWeight="bold">
                {item.market_value}
              </Text>
            </HStack>
            <HStack space={2} fontSize="xl">
              <Text color={'$foreground'} fontSize={FontSizes.size20}>
                Purchase Value :{' '}
              </Text>
              <Text color={'$foreground'} fontSize={FontSizes.size20} fontWeight="bold">
                {item.purchase_value}
              </Text>
            </HStack>
            <HStack space={2} fontSize="xl">
              <Text color={'$foreground'} fontSize={FontSizes.size20}>
                Sell Value :{' '}
              </Text>
              <Text color={'$foreground'} fontSize={FontSizes.size20} fontWeight="bold">
                {item.sell_value}
              </Text>
            </HStack>
          </VStack>
        )}
      />
      {/* <CreateOrEditAsset showModal={showModal} setShowModal={setShowModal} /> */}

      <CreateOrEditAsset
        trigger={
          // <Button
          //   _text={{ style: { fontSize: FontSizes.size16, padding: wp(1) } }}
          //   startIcon={<AddIcon size={wp(4)} />}
          // >
          //   Create Asset
          // </Button>
          <TouchableOpacity style={styles.addFab}>
            <AntDesign name="plus" color={'white'} size={wp(6)} />
          </TouchableOpacity>
        }
      />
    </VStack>
  )
}

const styles = StyleSheet.create({
  addFab: {
    height: wp(12),
    width: wp(12),
    borderRadius: wp(6),
    backgroundColor: THEME_COLORS.primary[50],
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    right: wp(4),
    bottom: wp(2),
  },
})
