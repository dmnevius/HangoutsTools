export default interface Takeout {
  conversation_state: {
    conversation_id: {
      id: string;
    };
    conversation_state: {
      conversation: {
        current_participant: {
          chat_id: string;
          gaia_id: string;
        }[];
        force_history_state: string;
        fork_on_external_invite: boolean;
        group_link_sharing_status: string;
        has_active_hangout: boolean;
        id: {
          id: string;
        };
        name: string;
        network_type: string[];
        otr_status: string;
        otr_toggle: string;
        participant_data: {
          fallback_name: string;
          id: {
            chat_id: string;
            gaia_id: string;
          };
          invitation_status: string;
          new_invitation_status: string;
          participant_type: string;
        }[];
        read_state: {
          latest_read_timestamp: string;
          participant_id: {
            chat_id: string;
            gaia_id: string;
          };
        }[];
        self_conversation_state: {
          active_timestamp: string;
          delivery_medium_option: {
            current_default: boolean;
            delivery_medium: {
              medium_type: string;
            };
          }[];
          invite_timestamp: string;
          inviter_id: {
            chat_id: string;
            gaia_id: string;
          };
          is_guest: boolean;
          notification_level: string;
          self_read_state: {
            latest_read_timestamp: string;
            participant_id: {
              chat_id: string;
              gaia_id: string;
            };
          };
          sort_timestamp: string;
          status: string;
          view: string[];
        };
        type: string;
      };
      conversation_id: {
        id: string;
      };
      event: {
        advances_sort_timestamp: boolean;
        chat_message?: {
          message_content: {
            segment: {
              text: string;
              type: string;
            }[];
          };
        };
        conversation_id: {
          id: string;
        };
        conversation_rename?: {
          new_name: string;
          old_name: string;
        };
        delivery_medium: {
          medium_type: string;
        };
        event_id: string;
        event_otr: string;
        event_type: string;
        event_version: string;
        hangout_event?: {
          event_type: string;
          media_type: string;
          participant_id: {
            chat_id: string;
            gaia_id: string;
          };
        };
        membership_change?: {
          leave_reason: string;
          participant_id: {
            chat_id: string;
            gaia_id: string;
          };
          type: string;
        };
        self_event_state: {
          notification_level: string;
          user_id: {
            chat_id: string;
            gaia_id: string;
          };
        };
        sender_id: {
          chat_id: string;
          gaia_id: string;
        };
        timestamp: string;
      }[];
      event_continuation_token: {
        event_timestamp: string;
        storage_continuation_token: string;
      };
    };
    response_header: {
      build_label: string;
      changelist_number: number;
      current_server_time: string;
      debug_url: string;
      request_trace_id: string;
      status: string;
    };
  }[];
}
