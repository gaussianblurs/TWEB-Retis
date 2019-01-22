import React from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Icon,
  Input,
  Button,
  message
} from 'antd'
import * as routes from '../../constants/routes'
import axios from '../../axios'

class NormalEditProfileForm extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (this.props.user.nickname === values.nickname) {
          this.props.history.push(routes.PROFILE)
        } else {
          axios.get(`/users/nickname/${values.nickname}`)
            .then(response => response.data)
            .then((userExists) => {
              if (userExists) {
                message.error('Nickname is already taken !')
              } else {
                axios.put('/users', {
                  nickname: values.nickname
                }, {
                  headers: { Authorization: `Bearer: ${this.props.idToken}` }
                })
                  .then(() => this.props.history.push(routes.PROFILE))
                  .catch(error => message.error(error.message))
              }
            })
            .catch(error => message.error(error.message))
        }
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { user } = this.props

    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <h2>Nickname</h2>
        <Form.Item>
          {getFieldDecorator('nickname', {
            rules: [{ required: true, message: 'Please input a nickname !' }]
          })(
            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder={user.nickname} />
          )}
        </Form.Item>
        <Form.Item>
          <div className="clearfix">
            <Button type="primary" htmlType="submit" className="submit-btn">
              Submit Changes
            </Button>
          </div>
        </Form.Item>
      </Form>
    )
  }
}

NormalEditProfileForm.propTypes = {
  history: PropTypes.PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
    getFieldsError: PropTypes.func.isRequired,
    getFieldError: PropTypes.func.isRequired,
    isFieldTouched: PropTypes.func.isRequired,
    validateFields: PropTypes.func.isRequired
  }).isRequired,
  user: PropTypes.shape({
    nickname: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(
      PropTypes.string.isRequired
    ).isRequired
  }).isRequired,
  idToken: PropTypes.string.isRequired
}

const WrappedEditProfileForm = Form.create({ name: 'edit_profile' })(NormalEditProfileForm)

export default WrappedEditProfileForm
