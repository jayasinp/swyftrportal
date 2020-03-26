import * as query from './issues.query'
import executor from '../executor'

export default class IssuesDao {

  static insertIssue (issue) {
    let {subject, description, categoryId, orderId} = issue;
    let args = [subject, description, categoryId, orderId];
    return executor.execute(query.INSERT_ISSUE, [args])
  }

  static updateIssue (issue) {
    let {subject, description, categoryId} = issue;
    let args = [subject, description, categoryId];
    return executor.execute(query.UPDATE_ISSUE, args)
  }

  static deleteIssue (issueId) {
    return executor.execute(query.DELETE_ISSUE, [issueId])
  }

}