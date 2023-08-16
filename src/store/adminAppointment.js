import { defineStore } from 'pinia'
import axios from 'axios'


export const useAppointmentStore = defineStore('admin_appointment', {
    state: () => ({

        //initial data
        stateData:{
            pending:null,
            approved:null,
            attended:null,
            appointments:null,
           
        },

        stateStatus:null,

       
        stateSelectedRow:null

    }),


    getters: {
      pending:(state)=>state.stateData.pending,
      approved:(state)=>state.stateData.approved,
      attended:(state)=>state.stateData.attended,
      selectedRow:(state)=>state.stateSelectedRow,
      status:(state)=>state.stateStatus,
      appointments:(state)=>state.stateData.appointments

    },


    actions: {
        setStatus(status){
            this.stateStatus=status
            console.log(this.stateStatus)
        },

        async index() {
            const data = await axios.get('api/admin/appointment')
            this.stateData.approved = data.data.approved
            this.stateData.attended = data.data.attended
            this.stateData.pending = data.data.pending
             this.stateData.appointments = data.data.appointments

            console.log( data.data.appointments)
        
     

        },

     
        async approve(){
            const data = await axios.post('api/admin/appointment/approve',{
                id: this.selectedRow.id
            })

            this.stateSelectedRow.done = 'approved'

        },
        async reject(remarks){
            const data = await axios.post('api/admin/appointment/reject',{
               id: this.stateSelectedRow.id,
               remarks:remarks
            })


            this.stateSelectedRow.done = 'rejected'
        },
        async reschedule(newSchedule){
            const  data = await axios.post('api/admin/appointment/change-schedule',{
                id: this.stateSelectedRow.id,
                newSchedule: newSchedule
            })

            this.stateSelectedRow.done = 'rescheduled'

        },

        async getData(status,path){
         
            const data = await axios.get(path)

            if(!status){
               
                this.stateData['appointments'] = data.data['appointments']
            }else{
                this.stateData[status] = data.data[status]
            }
           
        },

        async getApprovedByRange(dateRange){
            
            const data = await axios.post('api/admin/appointment/approved-with-range',{date:dateRange})

            this.stateData.approved = data.data.approved
        },
        
        async setRow(row){

            this.stateSelectedRow = row

        },
        async search(status, text){

            const data = await axios.post('api/admin/appointment/search',{
                status:status,
                search_item:text
            })

          
            if(!status){
               
                this.stateData['appointments'] = data.data['appointments']
            }else{
                this.stateData[status] = data.data[status]
            }




        },
        
        async filter(action){
            const data = await axios.post('api/admin/appointment/filter-by-action',{
                status:this.stateStatus,
                action:action
            })
            this.stateData[this.stateStatus] = data.data.appointments
        }
      
       
       

    },
})