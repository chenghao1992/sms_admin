exports.getChannelStatus = (status) => {
    let statusDesc = ''
    switch (status) {
        case 0:
            statusDesc = '开启'
            break
        case 1:
            statusDesc = '禁用'
            break
        default:
            statusDesc = '禁用'
            break
    }
    return statusDesc
}

exports.getTemplateType = (type) => {
    let typeDesc = ''
    switch (type) {
        case 0:
            typeDesc = '验证类'
            break
        case 1:
            typeDesc = '通知类'
            break
        default:
            typeDesc = '验证类'
            break
    }
    return typeDesc
}

exports.getTemplateStatus = (status) => {
    let statusDesc = ''
    switch (status) {
        case 1:
            statusDesc = '审核通过'
            break
        case 2:
            statusDesc = '审核拒绝'
            break
        default:
            statusDesc = '待审核'
            break
    }
    return statusDesc
}

exports.getSMSStatus = (status) => {
    let statusDesc = ''
    switch (status) {
        case 0:
            statusDesc = '定时发送'
            break
        case 1:
            statusDesc = '待发送'
            break
        case 2:
            statusDesc = '正在发送'
            break
        case 3:
            statusDesc = '发送成功'
            break
        case 4:
            statusDesc = '发送失败'
            break
        case 5:
            statusDesc = '取消发送'
            break
        default:
            statusDesc = '定时发送'
            break
    }
    return statusDesc
}

exports.getSMSStatusCompleted = (status) => {
    let statusDesc = ''
    switch (status) {
        case 0:
            statusDesc = '成功'
            break
        case 1:
            statusDesc = '失败'
            break
        case 2:
            statusDesc = '取消'
            break
    }
    return statusDesc
}
exports.getSMSType = (type) => {
    let typeDesc = ''
    switch (type) {
        case 1:
            typeDesc = '营销'
            break
        case 2:
            typeDesc = '通知'
            break
        default:
            typeDesc = ''
            break
    }
    return typeDesc
}
exports.listNote = (status) => {
    let errorMsg = '';
    if(!status){
        errorMsg = '--'
    }else{
        errorMsg = status;
    }
    return errorMsg
}