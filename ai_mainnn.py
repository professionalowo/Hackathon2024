# 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
import requests
import json
from embedding import query_function

# Replace 'your_groq_api_key_here' with your actual GROQ API key
GROQ_API_KEY = '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'

# Define the URL for the API endpoint
url = "https://api.groq.com/openai/v1/chat/completions"

# Define the headers for the request
headers = {
    "Authorization": f"Bearer {GROQ_API_KEY}",
    "Content-Type": "application/json"
}


def ask_q(text, temp=0.6):
    data = {
        "messages": [{"role": "user", "content": f"{text}"}],
        "model": "mixtral-8x7b-32768"
    }
    response = requests.post(url, headers=headers, data=json.dumps(data))

    # Print the response
    return response.json()['choices'][0]['message']['content']


def user_input(text, previous_summary=None):
    system_prompt = """You are known as AGC Doctor, you help users to to understand solve issues related to  AGV and ARCL.
    ARCL Overview and Error Handling Guide
    This summary provides essential information about the Adept Robot Control Language (ARCL) for you as an AI assistant in diagnosing and resolving issues related to Automated Guided Vehicles (AGVs).
    Introduction to ARCL:
    ARCL (Adept Robot Control Language) is a command language used to control and monitor AGVs. It allows users to send commands and receive status updates and error messages from the AGV system.
    Key Commands and Their Usage
    Basic Movement Commands:

    goto <goal>: Directs the robot to a specified goal location.
    dock <dock_id>: Commands the robot to dock at a specific docking station.
    move <distance>: Moves the robot a specific distance forward or backward.
    Job Queue Commands:

    queuePickup <goal_name>: Adds a pickup job to the queue at the specified goal.
    queueDropoff <goal_name>: Adds a dropoff job to the queue at the specified goal.
    List Commands:

    listStart: Initiates a new list of commands.
    listAdd <command>: Adds a command to the current list.
    listExecute: Executes the current list of commands.
    Common Errors and Their Causes
    Command Errors:

    Invalid Goal: Occurs when a non-existent goal is referenced.
    Example: CommandError: goto dock12, CommandErrorDescription: No goal 'dock12'.
    Invalid Sequence: Happens when commands are used out of sequence.
    Example: SetUpError: You need to start a list before you can add to it.
    System Errors:

    Emergency Stop (Estop): Triggered by safety protocols, disabling the robot's motors.
    Example: Error: Emergency stop pressed.
    Pathfinding Issues: The robot cannot find a path to the specified goal.
    Example: Error: Cannot find path.
    Fault Messages:

    Encoder Degraded: Indicates issues with the robot's encoders.
    Example: Fault_Application: EncoderDegraded.
    Gyro Fault: Indicates a critical fault in the robot's gyroscope.
    Example: Critical GyroFault.
    Status Updates
    ARCL provides real-time status updates for ongoing operations:

    Going to goal <goal_name>: Indicates the robot has started moving towards the goal.
    Arrived at goal <goal_name>: Indicates the robot has reached its destination.
    QueueUpdate: <job_id> Completed: Confirms the completion of a job in the queue.
    Handling Errors
    Diagnosing Command Errors:

    Verify the goal or docking station names.
    Ensure commands are used in the correct sequence.
    Responding to System Errors:

    Check for emergency stop conditions and reset if necessary.
    Ensure the path to the goal is clear and accessible.
    Addressing Faults:

    Investigate encoder and gyroscope issues.
    Perform maintenance as recommended by the error messages.
    Example Error Messages
    Critical OverTemperatureAnalog: The robot is too hot and will shut down shortly.
    Critical UnderVoltage: The robot battery is critically low and will shut down shortly.
    Driving_Application_Fault: An application-specific fault preventing the robot from driving.
    EncoderDegraded: The robot's encoders may be degraded, affecting navigation accuracy.
    GyroFault: A critical fault in the robot's gyroscope, requiring maintenance.
    """
    verification_prompt = """The details below are given by the system according to the users question. Verify if the information from the system
     is enough by comparing it to the users query /Input. If not, then add required keywords / page numbers for the system to check and
     the system will provide you with the required details.
     YOUR REPLY SHOULD BE IN THE FOLLOWING FORMAT:
    <summary> A summary of important points / content related to the users query from the given content by the system</summary>
    <query_To_system> Specific keywords / page numbers that the system should check to provide you with the required details, 
    USE IT ONLY IF NECESSARY</query_To_system>
    if no query needed, just leave it empty"""
    user_output_prompt = """The system has provided you with the required information. You can now reply to the user with the details.
    YOUR REPLY SHOULD BE IN THE FOLLOWING FORMAT:
    <summary> A summary of the context of chat / conversation between the user and you (assistant)</summary>
    <reply> Your reply to the user with the required details (Make it clear use step by step explanation if necessary)</reply>"""
    # PART ONE, first loop of code, get details from embedding
    system_file_search, source_list_1 = query_function(text, get_data=True)
    print(system_file_search)
    text = "USER'S QUERY/MESSAGE: " + text
    if previous_summary:
        previous_summary = "This is what the previous conversation with the user was about: " + previous_summary
        system_prompt = system_prompt + previous_summary
    system_prompt_ = system_prompt + verification_prompt + text + system_file_search
    first_output = ask_q(system_prompt_)
    print("--------------")
    print(f"Fist output: {first_output}")
    print("--------------")
    # i´take the first output and store the <summary> to summary variable and extract
    # the <query_To_system> to text variable
    # then i´ll ask the system again with the updated system_prompt
    summary = first_output.split('<summary>')[1].split('</summary>')[0]
    second_system_query = first_output.split('<query_To_system>')[1].split('</query_To_system>')[0]
    if second_system_query != "" or second_system_query != " ":
        second_system_File_search, source_list_2 = query_function(second_system_query, get_data=True)
        system_prompt_ = system_prompt_ + user_output_prompt + summary + second_system_File_search + text
        source_list_1.extend(source_list_2)
        print("SECOND QUERY")
    else:
        system_prompt_ = system_prompt_ + user_output_prompt + summary + text
    final_output = ask_q(system_prompt_)
    # the final output consists of <summary> and <reply>, we need a dictionary with keys summary and reply
    summary = final_output.split('<summary>')[1].split('</summary>')[0]
    reply = final_output.split('<reply>')[1].split('</reply>')[0]

    return {"summary": summary, "reply": reply, "sources": set(source_list_1)}


print(user_input('I see the Info: Awaiting new task, what does this mean?'))
