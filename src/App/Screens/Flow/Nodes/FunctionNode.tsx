import { memo, type FC, type CSSProperties, useCallback } from 'react';
import { Handle, Position, type NodeProps } from '@reactflow/core';
import { AiFillCodeSandboxCircle } from 'react-icons/ai';
import { useSetRecoilState } from 'recoil';
import Atoms from '../../../Constants/Atoms';
import { INode, IParams } from '../../../Constants/Interfaces/Node';
import { useNavigate } from 'react-router-dom';

const FunctionNode: FC<NodeProps> = ({ data }: { data: INode }) => {
  const navigate = useNavigate();
  const navigateToFlow = useCallback((id: string) => navigate(`/flow/${id}`, {replace: false}), [navigate]);

  const setCurrentNode = useSetRecoilState(Atoms.currentNode as any)
  const setIsEditorModalOpen = useSetRecoilState(Atoms.isEditorModalOpen)
  const setEditionType = useSetRecoilState(Atoms.editNodeType)
  
  var inputParams: IParams[] = data.inputs as IParams[];
  var outputParams: IParams[] = data.outputs as IParams[];

  let maxLength = (outputParams.length > inputParams.length ? outputParams.length : inputParams.length) || 1;
  let headerHeight = 5;
  let totalHeight = (headerHeight * maxLength) * 2;
  var bodyHeight = (totalHeight - headerHeight) * 2;
  let vertDistribution = bodyHeight / maxLength;

  return (
    <div style={{ ...styles.container, height: totalHeight }} id={data.id}>

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
      minHeight: 50, 
      minWidth: 150, 
    }}
      onDoubleClick={() => {
        if(data.script){
          setEditionType('child');
          setCurrentNode(data);
          setIsEditorModalOpen(true);
        }else{
          navigateToFlow(data.id);
        }
      }}>
        <span style={{ fontSize: 11, fontVariant: 'all-small-caps' }}>{data.name}</span>
        <span style={{ fontSize: 7, fontVariant: 'all-small-caps' }}>{data.version}</span>
        <AiFillCodeSandboxCircle size={16} />
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
    backgroundColor: 'black', 
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

export default memo(FunctionNode);
