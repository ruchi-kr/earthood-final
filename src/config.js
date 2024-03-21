export const base_url="https://earthood.intileotechno.info/api";
export const user_api_url="https://earthood.intileotechno.info/api/user";
export const BASE_DOCUMENT="https://earthood.intileotechno.info/uploads";

export const login_url=`${user_api_url}/login`;
export const getDashboardData = `${user_api_url}/getDashboardData`;
export const getAllClients = `${user_api_url}/getAllClients`;
export const getAllProposals = `${user_api_url}/getAllProposals`;
export const getCountryList = `${user_api_url}/getCountryList`;
export const saveClient = `${user_api_url}/saveClient`;
export const getClientDetails = `${user_api_url}/getClientDetails`;
export const pt_forgotpassword_url = `${user_api_url}/forgot_password`;
export const pt_forgotpassword_verify_url = `${user_api_url}/forgot_password_verify`;
export const pt_proposal_team_url = `${user_api_url}/proposalteam/submitproposalInfo`;
export const pt_proposal_submit_url = `${user_api_url}/proposalteam/submitproposalDocument`;
export const get_client_name_url = `${user_api_url}/get_clients`;
export const get_scope_url = `${user_api_url}/get_sectors`;
export const get_sectoralscope_url = `${user_api_url}/get_scopes`;
export const get_program_url = `${user_api_url}/get_programs`;
export const get_country_url = `${user_api_url}/getCountryList`;
export const get_assesment_url = `${user_api_url}/get_atlists`;
export const get_proposal_detail_url = `${user_api_url}/getProposalDetails`;
export const get_all_propoposal_url = `${user_api_url}/getAllProposals`;
export const pt_tm_proposalaction_url = `${user_api_url}/tm_proposalaction`;
export const mail_reminder_url = `${user_api_url}/reminder_settings`;
export const get_regions_url = `${user_api_url}/get_regions`;
export const get_pt_forwardToSales_url = `${user_api_url}/proposalteam/sentToSales`;
export const get_sales_action_url = `${user_api_url}/sales_action`;

const API_HEADER2 = {                                         
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + sessionStorage.getItem("token")
    }
}

export const API_HEADER=API_HEADER2;
