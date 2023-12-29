import React, { FC, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Text } from 'tamagui'
import { hp, wp } from '@/utils/responsive'
import { Feather } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native'
import { Menu, MenuItem } from 'react-native-material-menu'

interface IIncomeExpenseItemProps {
  onEdit: () => void
  onDelete: () => void
}

const IncomeExpenseItem: FC<IIncomeExpenseItemProps> = ({ onDelete = () => {}, onEdit = () => {} }) => {
  const [visible, setVisible] = useState(false)

  const showMenu = () => {
    setVisible(true)
  }

  const hideMenu = () => {
    setVisible(false)
  }

  const handleEditPress = () => {
    onEdit()
    hideMenu()
  }

  const handleDeletePress = () => {
    onDelete()
    hideMenu()
  }

  return (
    <View style={styles.container}>
      <View style={styles.bodyLeftContent}>
        <Text fontFamily={'$body'} fontSize={'$6'}>
          Hello
        </Text>
        <Text color={'$gray9Dark'} fontFamily={'$body'} fontSize={'$4'}>
          Hello
        </Text>
      </View>
      <View style={styles.moreIconButton}>
        <Menu
          visible={visible}
          anchor={
            <TouchableOpacity onPress={showMenu}>
              <Feather size={wp(4)} name="more-vertical" />
            </TouchableOpacity>
          }
          onRequestClose={hideMenu}
        >
          <MenuItem onPress={handleEditPress}>Edit</MenuItem>
          <MenuItem textStyle={{ color: 'red' }} onPress={handleDeletePress}>
            Delete
          </MenuItem>
        </Menu>
        <Text fontFamily={'$body'} fontSize={'$5'}>
          $ 20,000
        </Text>
      </View>
    </View>
  )
}

export default IncomeExpenseItem

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(4),
    elevation: 4,
    shadowColor: 'black',
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: wp(4),
    borderRadius: wp(2),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bodyLeftContent: {
    rowGap: hp(0.5),
    paddingRight: wp(2),
    flex: 1,
  },
  moreIconButton: {
    alignItems: 'flex-end',
    rowGap: hp(1),
  },
})