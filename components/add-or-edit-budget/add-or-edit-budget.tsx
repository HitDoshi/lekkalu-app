import { useEffect, useState } from 'react'
import { useToast } from 'native-base'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { omit } from 'lodash'
import { Text, View, useTheme, Input } from 'tamagui'
import { CalendarDays, X } from '@tamagui/lucide-icons'
import { Button, Dialog, XStack } from 'tamagui'
import { Dimensions, useColorScheme } from 'react-native'
import { FontSizes } from '@/utils/fonts'
import { THEME_COLORS } from '@/utils/theme'
import { BudgetSchema, budgetSchema } from '@/schema/budget'
import FormControl from '../form-control/form-control'
import { hp, wp } from '@/utils/responsive'
import RNDateTimePicker from '@react-native-community/datetimepicker'
import CustomButton from '../custom-button'
import { addItem, editItem } from '@/queries/local-state'
import { formatDate } from '@/utils/fn'
const { width, height } = Dimensions.get('window')

type AddOrEditBudgetProps = {
  title: string
  asset?: BudgetSchema
  showModal: boolean
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
  isEdit?: boolean
}

export default function CreateOrEditBudget({
  title,
  asset,
  showModal,
  setShowModal,
  isEdit = false,
}: AddOrEditBudgetProps) {
  const [date, setDate] = useState(new Date())
  const [isOpenDatePicker, setOpenDatePicker] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [isSelectedMonthExist,setSelectedMonthExist] = useState(false);

  const toast = useToast()

  console.log(asset)

  useEffect(() => {
    if (showModal && asset) {
      setDate(new Date(asset.month))
    }
  }, [showModal])

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<BudgetSchema>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      ...omit(asset, 'id'),
      limit: asset?.limit ? Number(asset.limit) : undefined,
      month: asset?.month ? new Date(asset.month) : new Date(),
    },
  })

  const handleAddBudget = (values: BudgetSchema) => {
    setLoading(true)

    setTimeout(()=>{
      try {
        console.log(values, 'from submit')
        const addedDataStatus = addItem('budget', { month: date, limit: values.limit })
  
        if (addedDataStatus) {
          reset()
          toast.show({
            title: 'Budget added successfully !!',
          })
          setShowModal(false)
          setSelectedMonthExist(false);
        }else{
          setSelectedMonthExist(true);
        }
      } catch (error) {
        console.log(error)
      }finally{
        setLoading(false)
      }
    },10)
    
  }

  const handleEditBudget = (values: BudgetSchema) => {
    setLoading(true)  

    setTimeout(() => {
      try {
        console.log(values, 'from submit')
        editItem('budget', { id: asset?.id, month: date, limit: values.limit })
        reset()
        toast.show({
          title: 'Budget edited successfully !!',
        })
        setShowModal(false)
      } catch (error) {
        console.log(error)
      }finally{
        setLoading(false)
      }
    },10)    
  }

  const handleCancelPress = () => {
    setShowModal(false)
  }

  return (
    <>
      <Dialog modal open={showModal}>
        <Dialog.Portal>
          <Dialog.Overlay
            key="overlay"
            // animation="bouncy"
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
            //   'bouncy',
            //   {
            //     opacity: {
            //       overshootClamping: true,
            //     },
            //   },
            // ]}
            // enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
            // exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
            gap="$2"
          >
            <Dialog.Title>
              <View flexDirection="row" justifyContent="space-between" width={width - 50} alignItems="center">
                <Text fontSize={FontSizes.size30}>{title}</Text>
                <Dialog.Close asChild>
                  <Button size="$2" circular icon={X} onPress={() => setShowModal(false)} />
                </Dialog.Close>
              </View>
            </Dialog.Title>
            <View>
              <FormControl>
                <FormControl.Label fontSize={FontSizes.size16} lineHeight={FontSizes.size20} isRequired>
                  Limit
                </FormControl.Label>
                <Controller
                  name="limit"
                  control={control}
                  render={({ field }) => (
                    <Input
                      fontSize={FontSizes.size15}
                      h={hp(6)}
                      defaultValue={asset?.limit?.toString() || ''}
                      br={wp(1.8)}
                      inputMode='numeric'
                      keyboardType="numeric"
                      placeholder="Enter Limit"
                      onChangeText={field.onChange}
                    />
                  )}
                />

                <FormControl.ErrorMessage fontSize={FontSizes.size15}>{errors.limit?.message}</FormControl.ErrorMessage>
              </FormControl>
            </View>

            {!isEdit && (
              <View>
                <FormControl>
                  <FormControl.Label fontSize={FontSizes.size16} lineHeight={FontSizes.size20}>
                    Month
                  </FormControl.Label>
                  <Controller
                    name="month"
                    control={control}
                    render={({ field }) => (
                      <View flexDirection="row" alignItems="center">
                        <Input
                          fontSize={FontSizes.size15}
                          h={hp(6)}
                          br={wp(1.8)}
                          keyboardType="numeric"
                          placeholder="Select budget month"
                          defaultValue={asset?.month?.toLocaleDateString()}
                          value={formatDate(date)}
                          disabled={true}
                          flex={1}
                        />
                        <CalendarDays
                          onPress={() => setOpenDatePicker(true)}
                          size="$1"
                          style={{ position: 'absolute', right: 8 }}
                          color={THEME_COLORS.primary[700]}
                        />
                      </View>
                    )}
                  />
                  {isSelectedMonthExist && <FormControl.ErrorMessage fontSize={FontSizes.size15}>Budget already alloted for this month.</FormControl.ErrorMessage>}
                </FormControl>
              </View>
            )}

            <XStack marginTop={'$2'} gap={10} justifyContent="space-between">
              <CustomButton
                isLoading={isLoading}
                onPress={() => handleCancelPress()}
                hasLikeOutline={true}
                text="Cancel"
              />

              <CustomButton
                isLoading={isLoading}
                onPress={isEdit ? handleSubmit(handleEditBudget) : handleSubmit(handleAddBudget)}
                text="Save"
              />
            </XStack>
          </Dialog.Content>
        </Dialog.Portal>
        {isOpenDatePicker && (
          <RNDateTimePicker
            value={date}
            display="calendar"
            onChange={(event, selectedDate) => {
              if (selectedDate !== undefined) {
                setOpenDatePicker(false)
                setDate(selectedDate)
                setSelectedMonthExist(false)
              }
            }}
          />
        )}
      </Dialog>
    </>
  )
}
