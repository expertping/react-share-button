import React from 'react'
import Visibility from './visibility'
import autoBind from 'react-auto-bind'

class SharePopup extends React.Component {
  constructor (props) {
    super(props)
    autoBind(this)
  }

  track (medium) {
    // const trackingData = {
    //   category: 'share',
    //   action: 'open_share',
    //   id: this.props.id,
    //   source: 'share_button',
    //   medium: medium,
    //   service_type: this.props.service
    // }
    this.props.toggleShare()
    // this.props.trackingActions.send(trackingData)
  }

  copyClicked (e) {
    const t = e.currentTarget
    const c = t.dataset.copytarget
    const inp = (c ? document.querySelector(c) : null)

    if (inp && inp.select) {
      inp.select()
      try {
        document.execCommand('copy')
        inp.blur()
      } catch (err) {
        alert('Please copy manually')
      }
    }
    this.track('copy')
  }

  whatsappClicked (e) {
    let link = ''
    if (document.body.dataset.os === 'android') {
      link = 'https://play.google.com/store/apps/details?id=com.whatsapp'
    } else if (document.body.dataset.os === 'iOS') {
      link = 'https://itunes.apple.com/app/id310633997'
    }
    const delay = 1000
    const start = new Date().getTime()
    setTimeout(() => {
      var end = new Date().getTime()
      if ((this.visibility && this.visibility.isHidden()) || (end - start >= delay * 2)) return
      window.open(link, '_blank')
    }, delay)
    this.track('whatsapp')
  }

  fbClicked () {
    this.track('fb')
  }

  twitterClicked () {
    this.track('twitter')
  }

  gmailClicked () {
    this.track('gmail')
  }

  render () {
    const text = this.props.text + ' ' + this.props.url
    const gmailURL = `https://mail.google.com/mail/u/0/?view=cm&ui=2&tf=0&fs=1&su=${this.props.text}&body=Check out this awesome property %0A${this.props.url}`
    return (
      <div className='share-popup'>
        {this.props.shareModalOpen && <Visibility ref={(node) => { this.visibility = node }} />}
        <a className='sp-tab' href={`whatsapp://send?text=${text}`} onClick={this.whatsappClicked}>
          <div className='icon whatsapp' />
          <span className='text'>WhatsApp</span>
        </a>
        <a className='sp-tab' href={`http://www.facebook.com/sharer.php?u=${encodeURIComponent(this.props.url)}&p[title]=${encodeURIComponent(this.props.text)}`} onClick={this.fbClicked} target='_blank'>
          <div className='icon fb' />
          <span className='text'>Facebook</span>
        </a>
        <a className='sp-tab' href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(this.props.text)}&url=${encodeURIComponent(this.props.url)}`} onClick={this.twitterClicked} target='_blank'>
          <div className='icon twitter' />
          <span className='text'>Twitter</span>
        </a>
        <a className='sp-tab' href={gmailURL} onClick={this.gmailClicked} target='_blank'>
          <div className='icon gmail' />
          <span className='text'>Mail</span>
        </a>
        <div className='sp-tab copy' onClick={this.copyClicked} data-copytarget='#url'>
          <div className='copy-input'>
            <input type='text' id='url' defaultValue={this.props.url} readOnly />
          </div>
          <div>
            <div className='icon copy' />
            <span className='text'>Copy to clipboard</span>
          </div>
        </div>
      </div>
    )
  }
}

export default class ShareBtn extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      shareModalOpen: false
    }
    this.toggleShare = this.toggleShare.bind(this)
  }

  toggleShare () {
    if (!this.state.shareModalOpen) {
      // const trackingData = {
      //   category: 'share',
      //   action: 'share',
      //   id: this.props.id,
      //   source: 'share_button',
      //   service_type: this.props.service
      // }
      // this.props.trackingActions.send(trackingData)
    }
    if (navigator && navigator.share !== undefined) {
      navigator.share({
        title: this.props.text,
        text: this.props.text + this.props.url,
        url: this.props.url
      }).then(() => console.log('Successful share'))
      .catch(error => console.log('Error sharing:', error))
    } else {
      document.body.style.overflow = !this.state.shareModalOpen ? 'hidden' : 'auto'
      this.setState({shareModalOpen: !this.state.shareModalOpen})
    }
  }

  render () {
    return (
      <div className={`share-btn ${this.props.className}`}>
        <div onClick={this.toggleShare}>
          {this.props.displayText}
        </div>
        <div className={`share-modal ${this.state.shareModalOpen ? 'open' : ''}`}>
          <div className='overlay' onClick={this.toggleShare} />
          <SharePopup {...this.props} toggleShare={this.toggleShare} shareModalOpen={this.state.shareModalOpen} />
        </div>
      </div>
    )
  }
}

ShareBtn.propTypes = {
  url: React.PropTypes.string,
  text: React.PropTypes.string,
  className: React.PropTypes.string,
  displayText: React.PropTypes.string
}

ShareBtn.defaultProps = {
  url: '',
  text: '',
  className: '',
  displayText: Share
}


SharePopup.propTypes = {
  url: React.PropTypes.string,
  text: React.PropTypes.string,
  shareModalOpen: React.PropTypes.bool,
  toggleShare: React.PropTypes.func
}
