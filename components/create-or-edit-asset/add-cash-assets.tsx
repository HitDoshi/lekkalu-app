import { cloneElement, useState } from 'react'
import { Modal, useToast } from 'native-base'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Text, View, useTheme } from 'tamagui'
import { X } from '@tamagui/lucide-icons'
import {  
  Button,
  Dialog,  
  Input,  
  XStack,
} from 'tamagui'
import { Dimensions, useColorScheme } from 'react-native'

import { AssetsCategoriesType, CashAssets, PhysicalAsset } from '@/types/balance-sheet'
import {
  AddCashAssetSchema,  
  addCashAssetSchema,
} from '@/schema/balance-sheet'
import { AssetCreateOrEditDto, addCashAsset, addPhysicalAsset, editCashAsset, editPhysicalAsset } from '@/queries/balance-sheet'
import { BALANCE_SHEET } from '@/utils/query-keys'
import { monthsToSeconds, yearsToSeconds } from '@/utils/time'
import { SERVER_DATE_FORMAT } from '@/utils/constants'
import InputFields from '../input-fields'
import { ASSET_INPUTS } from './config'
import { hp, wp } from '@/utils/responsive'
import { FontSizes } from '@/utils/fonts'
import { THEME_COLORS } from '@/utils/theme'
import { SelectAssetsItem } from './select-assets-item'
import FormControl from '@/components/form-control'
import { Controller } from 'react-hook-form'
import CustomButton from '../custom-button/custom-button'
const { width, height } = Dimensions.get('window')

type AddCashAssetsDialogProps = {
  showAssetsDialog: any
  setAddAssetsDialogVisibility: (type: AssetsCategoriesType) => void
  asset?: CashAssets
}

export default function AddCashAssetsDialog({
  showAssetsDialog,
  setAddAssetsDialogVisibility,
  asset,
}: AddCashAssetsDialogProps) {
  const toast = useToast()
  const qc = useQueryClient()
  const isEdit = Boolean(asset)
  const title = isEdit ? 'Edit Asset' : 'Add Asset'
  const theme = useTheme()
  const systemTheme = useColorScheme()

  const addCashAssetMutation = useMutation({
    mutationFn: addCashAsset,
    onSuccess: (data) => {
      console.log(data);
      
      qc.invalidateQueries({ queryKey: [BALANCE_SHEET.ASSETS] })
      toast.show({ title: 'Asset created successfully!' })
      setAddAssetsDialogVisibility('')
    },
    onError : (error) => {
      console.log(error);      
    }
  })

  const editCashAssetMutation = useMutation({
    mutationFn: (dto: CashAssets) => editCashAsset(asset?.id!, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [BALANCE_SHEET.ASSETS] })
      toast.show({ title: 'Asset updated successfully!' })
      setAddAssetsDialogVisibility('')
    },
  })  

  const handleAddOrEditCashAsset = (values: AddCashAssetSchema) => {    

    if (isEdit) {
      editCashAssetMutation.mutate(values)
      return
    }

    addCashAssetMutation.mutate(values)
  }

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AddCashAssetSchema>({
    resolver: zodResolver(addCashAssetSchema),
    defaultValues: {
      name: asset?.name ? String(asset.name) : '',
      balance: asset?.balance ? Number(asset.balance) : 0,
    },
  })

  const handleAddAssets = (values: AddCashAssetSchema) => {
    setAddAssetsDialogVisibility('')
    toast.show({
      title: 'Assets added successfully !!',
    })
  }

  const handleCancelAssets = () => {
    setAddAssetsDialogVisibility('')
  }

  return (
    <>
      <Dialog modal open={showAssetsDialog}>
        <Dialog.Portal>
          <Dialog.Overlay
            key="overlay"
            // animation="quick"
            // opacity={0.5}
            // enterStyle={{ opacity: 0 }}
            // exitStyle={{ opacity: 0 }}
          />

          <Dialog.Content
            bordered
            elevate
            key="content"
            // animateOnly={['transform', 'opacity']}
            // animation={[
            //   'quick',
            //   {
            //     opacity: {
            //       overshootClamping: true,
            //     },
            //   },
            // ]}
            // enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
            // exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
            gap="$3"
          >
            <Dialog.Title>
              <View flexDirection="row" justifyContent="space-between" width={width - 50} alignItems="center">
                <Text fontSize={FontSizes.size26}>Cash</Text>
                  <Button size="$1" circular icon={X} onPress={() => setAddAssetsDialogVisibility('')} />
              </View>
            </Dialog.Title>
            <View>
              <FormControl>
                <FormControl.Label fontSize={FontSizes.size16} lineHeight={FontSizes.size20} isRequired>
                  Name
                </FormControl.Label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      fontSize={FontSizes.size15}
                      h={hp(6)}
                      br={wp(1.8)}
                      placeholder="Enter name"
                      onChangeText={field.onChange}
                      {...field}
                    />
                  )}
                />
                <FormControl.ErrorMessage fontSize={FontSizes.size15}>
                  {errors.name?.message}
                </FormControl.ErrorMessage>
              </FormControl>
            </View>

            <View>
              <FormControl>
                <FormControl.Label fontSize={FontSizes.size16} lineHeight={FontSizes.size20} isRequired>
                  Balance
                </FormControl.Label>
                <Controller
                  name="balance"
                  control={control}
                  render={({ field }) => (
                    <Input
                      fontSize={FontSizes.size15}
                      h={hp(6)}
                      // br={wp(1.8)}
                      keyboardType="numeric"
                      placeholder="Enter your balance"
                      onChangeText={field.onChange}

                      // {...field}
                    />
                  )}
                />

                <FormControl.ErrorMessage fontSize={FontSizes.size15}>
                  {errors.balance?.message}
                </FormControl.ErrorMessage>
              </FormControl>
            </View>

            <XStack alignSelf="flex-end" marginTop={'$2'} gap={10} width={width - 50}>
              <CustomButton onPress={()=>{handleCancelAssets()}} hasLikeOutline={true} text='Cancel' isLoading={addCashAssetMutation.isPending || editCashAssetMutation.isPending} />

              <CustomButton onPress={handleSubmit(handleAddOrEditCashAsset)} text='Save' isLoading={addCashAssetMutation.isPending || editCashAssetMutation.isPending} />
            </XStack>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </>
  )
}
