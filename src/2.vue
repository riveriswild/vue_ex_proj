<template>
    <v-main>
        <v-container fluid>
            <v-row>
                    <v-breadcrumbs :items="breadcrumbs" large></v-breadcrumbs>
            </v-row>
            <v-row>
                <v-col sm="3" md='3' lg='2' cols="6">
                    <v-toolbar flat>
                     <!-- ИЗМЕНЕНИЕ ЗАЯВКИ -->
                        <v-dialog v-model="changeSelectedDialog" max-width="600px">
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                bottom
                                right
                                :disabled="selected.length == 0"
                                color="green"
                                outlined
                                v-bind="attrs"
                                v-on="on"
                                >
                                <v-icon>mdi-playlist-edit</v-icon>
                                &nbsp;
                                Изменить выбранные
                                </v-btn>
                            </template>
                            <v-card :loading="changeSelectedDialogLoading">
                                <loading :active.sync="notificationsChangeInProgress" 
                                :can-cancel="false" 
                                :is-full-page="false"></loading>
                                <v-card-title>
                                <span class="headline">Изменить статус для выбранных заявок</span>
                                </v-card-title>
                                <v-card-text>
                                Количество выбранных элементов: {{selected.length}}
                                <v-select
                                    v-model="changeSelectedDialogData.stateToChange"
                                    label="Статус заявки"
                                    :items="states"
                                    item-text="text"
                                    item-value="value"
                                    clearable
                                    type="number"
                                ></v-select>
                                <input type="checkbox" id="checkbox" v-model="changeSelectedDialogData.setAsViewed" />
                                <label for="checkbox">Пометить как просмотренно</label>
                                </v-card-text>
                                <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" 
                                @click="changeSelectedDialog=false" text
                                >Отменить
                                </v-btn>
                                <v-btn color="blue darken-1" 
                                :disabled="changeSelectedDialogData.stateToChange == null && changeSelectedDialogData.setAsViewed == false" 
                                @click="changeSelectedStates()" text
                                >Изменить
                                </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </v-toolbar>
                    </v-col>
                              <!-- УДАЛЕНИЕ -->
                <v-col sm="3" md='3' lg='3' cols="6">
                    <v-toolbar flat>
                        <v-dialog v-model="deleteSelectedDialog" max-width="600px">
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                bottom
                                right
                                :disabled="selected.length == 0"
                                color="red"
                                outlined
                                v-bind="attrs"
                                v-on="on"
                                >
                                <v-icon>mdi-playlist-remove</v-icon>
                                &nbsp;
                                Удалить выбранные
                                </v-btn>
                            </template>
                            <v-card :loading="deleteSelectedDialogLoading">
                                <loading :active.sync="notificationsChangeInProgress" 
                                :can-cancel="false" 
                                :is-full-page="false"></loading>
                                <v-card-title>
                                <span class="headline">Удалить выбранные заявки</span>
                                </v-card-title>
                                <v-card-text>
                                Количество выбранных элементов: {{selected.length}}
    
                                </v-card-text>
                                <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" 
                                @click="deleteSelectedDialog=false" text
                                >Отменить
                                </v-btn>
                                <v-btn color="blue darken-1"  
                                @click="deleteSelectedFin()" text
                                >Удалить
                                </v-btn>
                                </v-card-actions>
            
                            </v-card>
                        </v-dialog>
                        <v-btn color="blue darken-1" 
                        @click="cancelDeletion()" text
                        >
                        .
                        </v-btn>
                    </v-toolbar>
                </v-col>

                 <!-- ПОИСК -->
                <v-col sm="8" md='6' lg='6' cols="8">
                    <v-toolbar flat>
                        <v-select dense outlined hide-details clearable 
                        :items="states" item-text="text"
                            item-value="value" 
                            v-model="options.state" 
                            label="Статус"> </v-select>
                            <v-select dense outlined hide-details clearable 
                            :items="CitiesList"
                            item-text="project_code" 
                            item-value="id" 
                            v-model="options.city" 
                            label="Проект"> 
                            </v-select>
                        <v-text-field dense outlined hide-details clearable 
                        v-model="options.address" 
                        label="Адрес">
                        </v-text-field>
                        <v-text-field dense outlined hide-details clearable 
                        v-model="serial_number" 
                        label="Серийный номер"
                        >
                        </v-text-field>

                    </v-toolbar>
                </v-col>
            </v-row>

             <!-- РЕЗУЛЬТАТЫ -->

            <v-container fluid v-if="!loading && userNotificationsList.length < 1">У Вас нет заявок</v-container>

            <v-data-table v-else 
            v-model="selected" 
            :loading="loading"
            :options.sync="options" 
            :headers="headers"
                :items="filteredNotifications" 
                disable-sort show-select 
                item-key="id"
                @dblclick:row="editItem" 
                disable-pagination
                class="elevation-1" 
                hide-default-footer 
                >

     
                <template v-slot:footer.page-text="items">
                    {{ items.pageStart }} - {{ items.pageStop }} из {{ items.itemsLength }}
                </template>
                <template v-slot:item.created_at="{ item }">
                    <span :class="item.state == 0 ? 'font-weight-black' : ''">
                        <nuxt-link :to="`/usernotifications/${item.id}`"
                        >
                        {{ formatDate(item.created_at) }}
                        </nuxt-link>
                    </span>
                </template>

                <template v-slot:item.notification.device.address="{ item }">
                    <span :class="item.state == 0 ? 'font-weight-black' : ''">
                        <nuxt-link :to="`/devices/${item.notification.device.id}`"
                        >
                        {{ item.notification.device.address}}
                        </nuxt-link>
                    </span>
                </template>


                <template v-slot:item.notification.device.serial_number="{ item }">
                    <span :class="item.state == 0 ? 'font-weight-black' : ''">
                        {{ item.notification.device.serial_number }}
                    </span>
                </template>

                <!-- <template v-slot:item.notification.device.serial_number="{ item }">
                    <span :class="item.state == 0 ? 'font-weight-black' : ''">
                        {{ item }}
                    
                    </span>
                </template> -->

            
                <template v-slot:item.notification.info="{ item }">
                    <div style="max-width:800px;" 
                    v-for="(line, index) in splited(item.notification.info)" 
                    :key="index"
                        v-if="index < 5">
                        <span :class="item.state == 0 ? 'font-weight-bold' : ''">
                            {{ line }}
                        </span>
                    </div>
                    <div v-if="splited(item.notification.info).length > 4"
                        :class="item.state == 0 ? 'font-weight-black' : ''">
                        <span :class="item.state == 0 ? 'font-weight-black' : ''">
                            <nuxt-link :to="`/usernotifications/${item.id}`"
                            >
                            Подробнее...
                            </nuxt-link>
                        </span>
                    </div>
                </template>


                <template v-slot:item.notification.state="{ item }">
                    <span v-if="item.notification.state.state != null">
                        <span :class="item.state == 0 ? 'font-weight-bold' : ''">
                            {{ states.find((e) => e.value == item.notification.state.state).text }}
                            <small>
                                <br v-if="item.notification.state && item.notification.state.user" />
                                {{ item.notification.state && item.notification.state.user ?
                                        item.notification.state.user.username : ''
                                }}
                            </small>
                            <span v-if="item.notification.state.state != 0">
                                <!-- Отображать, если заявка не новая -->
                                <small>
                                    <br />
                                    {{ item.notification.state ? formatDate(item.notification.state.created_at) : '' }}
                                </small>
                            </span>
                        </span>
                    </span>
                    <span v-else>
                        Не установлен
                    </span>
                </template>
                <template v-slot:item.notification.type="{ item }">
                    <span v-if="item.notification.type_of != null" 
                    :class="item.state == 0 ? 'font-weight-bold' : ''">
        
                        {{ types.find((e) => e.value == item.notification.type_of).text }}
                    </span>
                </template>
            </v-data-table>
            <v-divider v-if="userNotificationsList.length > 0"></v-divider>

        </v-container>
    </v-main>
</template>

<script>
// Import component
import Loading from 'vue-loading-overlay';
// Import stylesheet
import 'vue-loading-overlay/dist/vue-loading.css';
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';

export default {

    data() {
        return {
            notificationsChangeInProgress: false,
            changeSelectedDialogData: { stateToChange: null,
                                        setAsViewed: false
                                        },
            deleteSelectedDialogData: { stateToChange: null,
                                        setAsViewed: false
                                        },
            changeSelectedDialog: false,
            changeSelectedDialogLoading: false,
            deleteSelectedDialog: false,
            deleteSelectedDialogLoading: false,
            selected: [],
            sortedNotifications: [],
            loading: false,
            canceled: false,

            states: [
                { value: 0, text: 'Инициирована' },
                { value: 1, text: 'Просмотрена' },
                { value: 2, text: 'В работе' },
                { value: 3, text: 'Выполнена' },
                { value: 4, text: 'Закрыта' }
            ],
            types: [
                { value: 0, text: 'Неисправность' },
                { value: 1, text: 'Связь' },
                { value: 2, text: 'Периодическое обслуживание' },
            ],
            options: {
                page: 1,
                itemsPerPage: 10,
            },
            serial_number: '',

            breadcrumbs: [
                {
                    text: 'Входящие заявки',
                    disabled: true,
                    href: '/usernotifications',
                },
            ],
            headers: [
                // { text: '', value: 'selected' },
                { text: 'Объект', value: 'notification.device.address' },
                { text: 'Serial', value: 'notification.device.serial_number' },
                { text: 'Code', value: 'this.notProject' },
                { text: 'Дата, время', value: 'created_at', align: 'start' },
                { text: 'Статус', value: 'notification.state' },
                { text: 'Тип', value: 'notification.type' },
                { text: 'Информация', value: 'notification.info', width: '60%' }
            ],
        }
    },

    watch: {
        options: {
            handler() {
                this.loadItems();
                // console.log('citieslist', this.CitiesList)
                // console.log('deviceslist', this.devicesList)
                // // console.log('this', this)
                // // console.log('1', this.notProject())
            },
            deep: true,
        },
        serial_number: {
            handler() {
                this.filterBySerial(this.serial_number)
            }
        }
    },

    created() {
        this.loadItems();
        // this.filterBySerial(this.serial_number)
    },
    components: {
        Loading
    },
    computed: {
        ...mapState('userNotificationsList', ['userNotificationsList', 'totalCount']),
        ...mapState('userNotification', ['uNotification', ]),
        ...mapState('auth', ['id']),
        ...mapState('citiesList', ['citiesList', 'totalCityCount']),
        ...mapGetters('citiesList', ['CitiesList', 'DefaultCity']),
        ...mapState('devicesList', ['devicesList', 'totalCount', 'devicesOptions']),

        filteredNotifications() {
            if (this.sortedNotifications.length) {
                return this.sortedNotifications;
            } else {
                return this.userNotificationsList
            }
        }



    },

    methods: {
        ...mapActions('userNotification', ['getUserNotificationDirectly']),
        ...mapActions('userNotificationsList', ['getUserNotificationsList']),
        ...mapActions('auth', ['retrieveUser']),
        ...mapActions('citiesList', ['getCitiesList', 'CitiesList']),
        ...mapActions('devicesList', ['getDevicesList', 'DevicesList']),

        editItem(event, { item }) {
            this.$router.push(`/usernotifications/${item.id}`)
        },

        splited(value) {
            if (typeof value != 'undefined') {
                return value.split('\n')
            } else {
                return []
            }
        },
        filterBySerial(serial_number) {
            let vm = this
            const devicList = [...this.devicesList]
            console.log('DEV', devicList)
            console.log('devList in filter1', this.devicesList)
            console.log('this before if', this)
            if (serial_number) {

                this.sortedNotifications = [...this.userNotificationsList]
                this.sortedNotifications = this.sortedNotifications.filter(function(item) {
                    console.log('vm', vm)
                    console.log('this after if', this)
                    console.log('item', item)
                    console.log('serial', serial_number)
                    console.log(vm.serial_number)
                    return item.notification.device.serial_number === vm.serial_number
                    }) 
                    if (vm.options.city){
                        vm.filterByProjectCode(vm.sortedNotifications, devicList)
                    }
                    
                    
            } else {
                //this.options.serial_number = ''
                this.sortedNotifications = this.userNotificationsList
            }
        },

        filterByProjectCode(list, devvList) {
                let vm = this
                console.log("this in project code", this)
                console.log('passed vm.usernot', list)
                console.log('passed devicList', devvList)
                let citiesList = [...this.CitiesList]
                const devList = devvList
                console.log("devList", devList)
                console.log("devList2", this.$store.state.devicesList)
                this.sortedNotifications = list.filter(function(item) {
                    let deviceId = item.notification.device.id
                    console.log("devId", deviceId)
                    let device = devList.find(item => item.id == deviceId)
                    console.log('device', devList)
                    console.log('deviceName', device)
                    let cityName = device.city.name
                    let city = citiesList.find(item => item.name == cityName)
                    let cityId = city.id
                    return cityId === vm.options.city
                    })

            


        },

        // notProject() {
        //     const projCode = this.CitiesList
        //     console.log('1', this.projCode)
        //     console.log(this.CitiesList)
        //     return projCode

        // },

        // findBySerial() {
        //     if (this.options.serial_number) {
        //         return this.getUserNotificationsList.filter(this.checkId(this.options.serial_number))
        //     }
        // },

        // checkId() {
        // //    console.log("11", c)
        // console.log(this.)
        //     //return selectedId.notification.device.serial_number === this.options.serial_number
        //     return this.notification.device.serial_number === this.options.serial_number
            
        // },

        async updateData() {
            await this.retrieveUser();
            await this.loadItems();
        },
        formatDate(dateStr) {
            let comment_time = new Date(dateStr)
            return comment_time.toLocaleString()
        },


        async changeSelectedStates() {
            this.notificationsChangeInProgress = true;
            Promise.all(this.selected.map( 
                value => this.changeNotificationStatus(value, this.changeSelectedDialogData.stateToChange, this.changeSelectedDialogData.setAsViewed)))
                .then( () => { this.notificationsChangeInProgress = false;
                    this.changeSelectedDialogLoading = false;
                    this.changeSelectedDialog = false;
                    this.updateData();
                    this.selected = [];}
                );
        },



        async deleteSelectedStates() {
            this.notificationsChangeInProgress = true;
                Promise.all(this.selected.map( 
                value => this.deleteNotification(value)))
                .then( () => { this.notificationsChangeInProgress = false;
                    this.deleteSelectedDialogLoading = false;
                    this.deleteSelectedDialog = false;
                    this.updateData();
                    this.selected = [];}
                );
        },


        deleteSelectedFin() {
            this.timeOutId = setTimeout(this.deleteSelectedStates, 5000)
            this.notificationsChangeInProgress = false;
                    this.deleteSelectedDialogLoading = false;
                    this.deleteSelectedDialog = false;
        },

        cancelDeletion() {
            clearTimeout(this.timeOutId)
            this.canceled = false
        },

        async changeNotificationStatus(notification, status, markAsViewed) {
            if (status != null) {
                var userNot = await this.getUserNotificationDirectly(notification.id)
                userNot.state = status;
                await this.$notificationsService.update(userNot.notification.id, userNot);
            }
            if (markAsViewed)
                await this.$userNotificationsService.update(notification.id, {state: 1});
        },
        

        async deleteNotification(notification) {
            await this.$userNotificationsService.delete(notification.id);
            // this.$router.push('/usernotifications')
            },

        async loadItems() {
            this.loading = true;
            await this.getUserNotificationsList(this.options)
            console.log('this',this.options)
            this.filterBySerial(this.serial_number)
            await this.getCitiesList({ short: true, page: 1, itemsPerPage: -1 });
            await this.getDevicesList(this.options);
            // console.log(this.CitiesList)
            // console.log('devList', this.devicesList)
            this.loading = false;
        }
    }

}
</script>

<style>
.data-disabled {
    color: rgb(50, 50, 50) !important;
}

.device-no-connection {
    color: rgb(120, 120, 120) !important;
}

.hide {
    visibility: hidden !important;
}
</style>
