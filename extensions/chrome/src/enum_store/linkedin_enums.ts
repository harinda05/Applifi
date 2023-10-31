export enum Pagetype {
    saved,
    search
}

// RuntimeCommandType Popup Background Popup
export enum RuntimeCommandType_PBP {
    enable_generate_event,
    disable_generate_event,
    generate_btn_click_event,
    request_enable_generate_event,
    request_enable_setup_event,
    enable_setup_event,
    disable_setup_event,
    file_upload_event
}

// RuntimeCommandType ContentScript Background ContentScript
export enum RuntimeCommandType_CBC {
    get_job_details_request_search_jobs
}