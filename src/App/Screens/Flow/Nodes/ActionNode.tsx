import { memo, type FC, type CSSProperties, useEffect } from 'react';
import { Handle, Position, type NodeProps, HandleType } from '@reactflow/core';
import { AiFillApi, AiFillCodeSandboxCircle, AiFillPlaySquare, AiTwotonePlayCircle } from 'react-icons/ai';
import { useRecoilState, useSetRecoilState } from 'recoil';
import Atoms from '../../../Constants/Atoms';
import { FaPlay } from 'react-icons/fa';

export interface IParams {
  id: string,
  type: HandleType,
  name: string
}

const ActionNode: FC<NodeProps> = ({ data }) => {
  const [currentFlowNode, setCurrentFlowNode] = useRecoilState(Atoms.currFlowNode)
  const setCurrentNode = useSetRecoilState(Atoms.currentNode)
  const setIsEditorModalOpen = useSetRecoilState(Atoms.isEditorModalOpen)
  const setEditionType = useSetRecoilState(Atoms.editNodeType)

  let type: string = data.type;
  let name: string = 'Action Node';
  let color: any = 'gray';
  let inputParams: Array<IParams> = [];
  let outputParams: Array<IParams> = [];

  let maxLength = (outputParams.length > inputParams.length ? outputParams.length : inputParams.length) || 1;
  let headerHeight = 5;
  let totalHeight = (headerHeight * maxLength) * 2;
  let bodyHeight = (totalHeight - headerHeight) * 2;
  let vertDistribution = bodyHeight / maxLength;

  if(type == 'start'){
    color = '#317331';
    name = 'Start'; 
    outputParams = data.outputs;
   }
 
   if(type == 'finish'){
     color = '#ce3d4c';
     name = 'Finish'; 
     inputParams = data.inputs;
  }

  return (
    <div style={{ ...styles.container, height: totalHeight }} id={`actionNode-${type}`}>

      <div>
        {
          inputParams.map((input: IParams, index: number) =>
            <div key={input.id}>
              <Handle type={'target'} id={input.id} position={Position.Left}
                style={{ ...styles.ioContainer, ...styles.inputContainer, top: (vertDistribution * index) + headerHeight + 10 }}>
                <span style={styles.inputText}>{input.name}</span>
              </Handle>
            </div>
          )
        }
      </div>

      <div style={{ ...styles.bodyNode, 
      backgroundColor: color,
      minHeight: 50, 
      minWidth: 120, 
      padding: 5,
      flexDirection: type == 'start' ? 'row' : 'row-reverse',
    }}
      onDoubleClick={() => {
        setEditionType('this');
        setCurrentNode(currentFlowNode);
        setIsEditorModalOpen(true);
      }}>
        {
          type == 'finish' ? <AiFillApi size={16} /> : <></>
        }
        {
          type == 'start' ? <FaPlay size={16} /> : <></>
        }
        <span style={{ fontSize: 11, fontVariant: 'all-small-caps', paddingInline: 5 }}>{name}</span>
      </div>

      <div>
        {
          outputParams.map((output: IParams, index: number) =>
            <div key={output.id}>
              <Handle type={'source'} id={output.id} position={Position.Right}
                style={{ ...styles.ioContainer, ...styles.outputContainer, top: (vertDistribution * index) + headerHeight + 10 }}>
                <span style={styles.outputText}>{output.name}</span>
              </Handle>
            </div>
          )
        }
      </div>
    </div>
  );
};

const styles: { [key: string]: CSSProperties } = {
  container: {
    position: 'relative',
    display: 'flex',
    zIndex: 1,
  },
  textBox: {
    width: '50%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 5,
    padding: 3,
    marginTop: '-15px',
    zIndex: 11
  },
  linkBoxCode: {
    position: 'relative',
    textAlign: 'center',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    zIndex: 0,
    fontSize: 10,
    borderWidth: 0,
    width: '100%',
    borderStyle: 'solid',
    fontWeight: 'bold',
    paddingTop: '10%',
    cursor: 'help'
  },
  ioContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    color: 'white',
    background: 'white',
    borderColor: 'gray'
  },
  bodyNode: {
    display: 'flex',
    flexWrap: 'nowrap',
    alignContent: 'center',
    alignItems: 'center',
    color: 'white', 
    justifyContent: 'flex-start', 
    flexDirection: 'column',
    borderRadius: 4
  },
  inputContainer: {

  },
  inputText: {
    top: -4,
    fontSize: 8,
    paddingLeft: 8
  },
  outputContainer: {

  },
  outputText: {
    position: 'absolute',
    textAlign: 'right',
    right: 8,
    top: -4,
    fontSize: 8,
  }
}

export default memo(ActionNode);
